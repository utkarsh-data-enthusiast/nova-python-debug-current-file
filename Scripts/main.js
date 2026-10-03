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
    }
}


function getFocusedOrRememberedFile() {
    rememberFocusedFile();

    if (lastFocusedFile) {
        return lastFocusedFile;
    }

    throw new Error(
        "Open a file inside the Python or Jupyter folder first."
    );
}


function isInsideFolder(filePath, folderPath) {
    const file = nova.path.normalize(filePath);
    const folder = nova.path.normalize(folderPath);

    return (
        file === folder ||
        file.startsWith(folder + "/")
    );
}


function getMode(filePath) {
    const root = nova.workspace.path;

    if (!root) {
        throw new Error(
            "This Nova project is not attached to a folder."
        );
    }

    const pythonFolder =
        nova.path.join(root, "Python");

    const jupyterFolder =
        nova.path.join(root, "Jupyter");

    const extension =
        nova.path.extname(filePath).toLowerCase();


    if (
        isInsideFolder(filePath, jupyterFolder) ||
        extension === ".ipynb"
    ) {
        return "jupyter";
    }


    if (
        isInsideFolder(filePath, pythonFolder) &&
        extension === ".py"
    ) {
        return "python";
    }


    throw new Error(
        "Focus a .py file inside Python, or a file inside Jupyter."
    );
}


function getPythonFileForDebugging() {
    const filePath =
        getFocusedOrRememberedFile();

    if (
        nova.path.extname(filePath).toLowerCase()
        !== ".py"
    ) {
        throw new Error(
            "Open or focus a Python (.py) file before debugging."
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
                nova.path.dirname(filePath)
        }
    );
}


function createJupyterRunAction() {
    const root =
        nova.workspace.path;

    const jupyterFolder =
        nova.path.join(
            root,
            "Jupyter"
        );

    return new TaskProcessAction(
        JUPYTER,
        {
            args: [
                "lab"
            ],

            cwd:
                jupyterFolder
        }
    );
}


function createPythonDebugAction(filePath) {
    const workingDirectory =
        nova.path.dirname(filePath);

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

        // SECOND TASK:
        // Real Debug Task launched through ▶ Run.
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
         * ------------------------------------------------
         * PYTHON DEBUG TASK
         * ------------------------------------------------
         *
         * Python Debug → ▶ Run
         *
         * This bypasses Build completely.
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
         * ------------------------------------------------
         * EXISTING SMART PYTHON TASK
         * ------------------------------------------------
         */

        const filePath =
            getFocusedOrRememberedFile();

        const mode =
            getMode(filePath);


        // ▶ RUN
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
                return createJupyterRunAction();
            }
        }


        // 🔨 BUILD
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
                throw new Error(
                    "The hammer is for debugging Python .py files. Use ▶ Run to start JupyterLab."
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