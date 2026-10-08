let taskAssistant = null;
let fileTracker = null;
let lastFocusedFile = null;

const PYTHON =
	"/Library/Frameworks/Python.framework/Versions/3.14/bin/python3.14";

const JUPYTER =
	"/Library/Frameworks/Python.framework/Versions/3.14/bin/jupyter";


function rememberFocusedFile() {
	const editor = nova.workspace.activeTextEditor;

	if (
		editor &&
		editor.document &&
		editor.document.path
	) {
		lastFocusedFile = editor.document.path;
		return lastFocusedFile;
	}

	return null;
}


function getFocusedOrRememberedFile() {
	const focusedFile = rememberFocusedFile();

	if (focusedFile) {
		return focusedFile;
	}

	if (lastFocusedFile) {
		return lastFocusedFile;
	}

	throw new Error(
		"Open and focus a file inside Python or Jupyter first."
	);
}


function isInsideFolder(filePath, folderPath) {
	const file =
		nova.path.normalize(filePath);

	const folder =
		nova.path.normalize(folderPath);

	return (
		file === folder ||
		file.startsWith(folder + "/")
	);
}


function getProjectFolders() {
	const root = nova.workspace.path;

	if (!root) {
		throw new Error(
			"This Nova project is not attached to a folder."
		);
	}

	return {
		root: root,

		pythonFolder:
			nova.path.join(
				root,
				"Python"
			),

		jupyterFolder:
			nova.path.join(
				root,
				"Jupyter"
			)
	};
}


function getMode(filePath) {
	const folders =
		getProjectFolders();

	const extension =
		nova.path
			.extname(filePath)
			.toLowerCase();


	/*
	 * .ipynb anywhere = Jupyter
	 */

	if (extension === ".ipynb") {
		return "jupyter";
	}


	/*
	 * .py inside Python/ OR Jupyter/ = Python
	 */

	if (
		extension === ".py" &&
		(
			isInsideFolder(
				filePath,
				folders.pythonFolder
			) ||
			isInsideFolder(
				filePath,
				folders.jupyterFolder
			)
		)
	) {
		return "python";
	}


	/*
	 * Any other file inside Jupyter/ = Jupyter
	 */

	if (
		isInsideFolder(
			filePath,
			folders.jupyterFolder
		)
	) {
		return "jupyter";
	}


	throw new Error(
		"Focus a .py file inside Python or Jupyter, an .ipynb notebook, or another file inside the Jupyter folder."
	);
}


function getPythonFileForDebugging() {
	const filePath =
		getFocusedOrRememberedFile();

	const folders =
		getProjectFolders();

	const extension =
		nova.path
			.extname(filePath)
			.toLowerCase();


	if (
		extension !== ".py" ||
		!(
			isInsideFolder(
				filePath,
				folders.pythonFolder
			) ||
			isInsideFolder(
				filePath,
				folders.jupyterFolder
			)
		)
	) {
		throw new Error(
			"Open and focus a Python (.py) file inside the Python or Jupyter folder before debugging."
		);
	}


	return filePath;
}


function createPythonRunAction(filePath) {
	return new TaskProcessAction(
		PYTHON,
		{
			args: [
				filePath
			],

			cwd:
				nova.path.dirname(
					filePath
				)
		}
	);
}


function createJupyterRunAction(filePath) {
	const folders =
		getProjectFolders();

	const extension =
		nova.path
			.extname(filePath)
			.toLowerCase();


	/*
	 * Focused notebook:
	 * launch JupyterLab and open it directly.
	 */

	if (extension === ".ipynb") {
		return new TaskProcessAction(
			JUPYTER,
			{
				args: [
					"lab",
					filePath
				],

				cwd:
					nova.path.dirname(
						filePath
					)
			}
		);
	}


	/*
	 * Other file inside Jupyter/:
	 * launch JupyterLab in Jupyter folder.
	 */

	return new TaskProcessAction(
		JUPYTER,
		{
			args: [
				"lab"
			],

			cwd:
				folders.jupyterFolder
		}
	);
}


function createPythonDebugAction(filePath) {
	const workingDirectory =
		nova.path.dirname(
			filePath
		);


	const action =
		new TaskDebugAdapterAction(
			"debugpy"
		);


	action.command =
		PYTHON;


	action.args = [
		"-m",
		"debugpy.adapter"
	];


	action.adapterStart =
		"launch";


	action.transport =
		"stdio";


	action.debugRequest =
		"launch";


	action.cwd =
		workingDirectory;


	action.debugArgs = {
		program:
			filePath,

		python: [
			PYTHON
		],

		cwd:
			workingDirectory,

		console:
			"internalConsole",

		justMyCode:
			true,

		redirectOutput:
			true,

		stopOnEntry:
			false
	};


	return action;
}


class PythonSmartTaskAssistant {

	provideTasks() {

		/*
		 * Clean debugger:
		 * Python Debug + ▶
		 */

		const debugTask =
			new Task(
				"Python Debug"
			);


		debugTask.setAction(
			Task.Run,

			new TaskResolvableAction({
				data: {
					type:
						"python-debug"
				}
			})
		);


		return [
			debugTask
		];
	}


	resolveTaskAction(context) {

		/*
		 * Python Debug task
		 */

		if (
			context.data &&
			context.data.type ===
				"python-debug"
		) {

			const filePath =
				getPythonFileForDebugging();


			return createPythonDebugAction(
				filePath
			);
		}


		/*
		 * Smart Python task
		 */

		const filePath =
			getFocusedOrRememberedFile();


		const mode =
			getMode(
				filePath
			);


		/*
		 * ▶ RUN
		 */

		if (
			context.action ===
			Task.Run
		) {

			if (
				mode === "python"
			) {
				return createPythonRunAction(
					filePath
				);
			}


			if (
				mode === "jupyter"
			) {
				return createJupyterRunAction(
					filePath
				);
			}
		}


		/*
		 * 🔨 BUILD / HAMMER
		 */

		if (
			context.action ===
			Task.Build
		) {

			if (
				mode === "python"
			) {
				return createPythonDebugAction(
					filePath
				);
			}


			if (
				mode === "jupyter"
			) {
				return createJupyterRunAction(
					filePath
				);
			}
		}


		return null;
	}
}


exports.activate =
function() {

	rememberFocusedFile();


	fileTracker =
		setInterval(
			rememberFocusedFile,
			200
		);


	taskAssistant =
		nova.assistants
			.registerTaskAssistant(

				new PythonSmartTaskAssistant(),

				{
					identifier:
						"python-smart",

					name:
						"Python"
				}
			);
};


exports.deactivate =
function() {

	if (
		fileTracker !== null
	) {

		clearInterval(
			fileTracker
		);


		fileTracker =
			null;
	}


	if (
		taskAssistant
	) {

		taskAssistant.dispose();


		taskAssistant =
			null;
	}
};