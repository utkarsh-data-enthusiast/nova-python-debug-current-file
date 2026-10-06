let taskAssistant = null;
let fileTracker = null;
let lastFocusedFile = null;

const ENV = "/usr/bin/env";
const PYTHON = "python3";
const JUPYTER = "jupyter";


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
        "Open or focus a Python (.py) file or Jupyter notebook (.ipynb) first."
    );
}


function getMode(filePath) {
    const extension =
        nova.path.extname(filePath).toLowerCase();

    if (extension === ".ipynb") {
        return "jupyter";
    }

    if (extension === ".py") {
        return "python";
    }

    throw new Error(
        "Focus a Python (.py) file or Jupyter notebook (.ipynb) first."
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
        ENV,
        {
            args: [
                PYTHON,
                filePath
            ],

            cwd:
                nova.path.dirname(filePath)
        }
    );
}


function createJupyterRunAction(filePath) {
    return new TaskProcessAction(
        ENV,
        {
            args: [
                JUPYTER,
                "lab"
            ],

            cwd:
                nova.path.dirname(filePath)
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
        ENV;
    
    action.args = [
        PYTHON,
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
                    return createJupyterRunAction(
                        filePath
                    );
                }
            }
            
            
            // 🔨 BUILD


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