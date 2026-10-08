# Contributing to Python Run and Debug

Thank you for your interest in improving **Python Run and Debug**.

This document explains how the extension is structured, how its Python, debugging, and Jupyter workflows operate, how to test changes locally in Nova, and how releases should be prepared.

The project is maintained by **PatriotEver Lab**.

---

## Project Overview

Python Run and Debug is a Nova task extension designed to provide a simple workflow for:

- Running the currently focused Python `.py` file
- Debugging Python files using `debugpy`
- Using breakpoints through Nova's native debugging interface
- Launching JupyterLab from a focused `.ipynb` notebook
- Working with Python and Jupyter files regardless of their folder names
- Resolving `python3` and `jupyter` through the user's environment

The extension intentionally avoids depending on a fixed Python installation path.

---

## Project Structure

The extension currently uses the following structure:

```text
Python Run and Debug.novaextension/
├── CHANGELOG.md
├── CONTRIBUTING.md
├── HELP.md
├── LICENSE
├── README.md
├── extension.json
├── extension.png
├── python-debug-demo.png
└── Scripts/
	└── main.js
```

### `extension.json`

The extension manifest defines:

- Extension identifier
- Extension name and organization
- Description
- Version
- Repository
- Bug-reporting URL
- License
- Entitlements
- Debug adapter
- Breakpoint support
- Python Task Template
- Activation events

### `Scripts/main.js`

This contains the runtime logic for:

- Tracking the currently focused file
- Detecting Python and Jupyter files
- Running Python
- Launching JupyterLab
- Starting `debugpy`
- Providing the Python Debug task
- Resolving Nova Task actions

### `README.md`

User-facing documentation displayed in Nova's Extension Library **Details** pane.

### `HELP.md`

Dedicated setup and troubleshooting documentation displayed through Nova's **Help** interface.

### `CHANGELOG.md`

Release history displayed through Nova's **Release Notes** interface.

### `LICENSE`

Contains the MIT License for the project.

### `python-debug-demo.png`

Demonstration screenshot used by the README and Extension Library documentation.

---

## How File Detection Works

The extension remembers the currently focused editor file.

The important function is conceptually:

```javascript
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
```

This means behavior is determined by the file extension rather than by a folder name.

A Python file can therefore be located anywhere in the project:

```text
Project/
├── app.py
├── scripts/
│   └── analysis.py
└── tests/
	└── test_app.py
```

The files do not need to be inside a folder named `Python`.

Likewise, Jupyter notebooks do not need to be inside a folder named `Jupyter`.

---

## Environment-Based Command Resolution

The extension uses:

```javascript
const ENV = "/usr/bin/env";
const PYTHON = "python3";
const JUPYTER = "jupyter";
```

Commands are launched through `/usr/bin/env`.

This avoids depending on a path such as:

```text
/Library/Frameworks/Python.framework/Versions/...
```

and allows the extension to work with different Python installation methods as long as the required commands are available in the environment visible to Nova.

Users should be able to verify their environment with:

```bash
python3 --version
python3 -m debugpy --version
jupyter --version
```

---

## Python Run Workflow

The **Python** Task Template provides a Run action.

When the focused file is a `.py` file, the extension creates a process action equivalent to:

```bash
/usr/bin/env python3 /path/to/current-file.py
```

The working directory is set to the directory containing the focused Python file.

Conceptually:

```javascript
function createPythonRunAction(filePath) {
	return new TaskProcessAction(
		"/usr/bin/env",
		{
			args: [
				"python3",
				filePath
			],

			cwd:
				nova.path.dirname(filePath)
		}
	);
}
```

This allows relative file operations performed by the Python program to use the script's containing directory as the working directory.

---

## Python Debug Workflow

Python debugging uses Nova's native debug adapter system with `debugpy`.

The extension starts the adapter through:

```bash
/usr/bin/env python3 -m debugpy.adapter
```

The debug request launches the currently focused Python file.

Important configuration includes:

```javascript
action.adapterStart = "launch";
action.transport = "stdio";
action.debugRequest = "launch";
```

The debug configuration includes the focused file as the program:

```javascript
action.debugArgs = {
	program: filePath,

	python: [
		"python3"
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
```

This provides breakpoint support through Nova's native debugging interface.

---

## Two Debugging Entry Points

The extension currently exposes two ways to start Python debugging.

### Python Debug Task

The extension dynamically provides a task named:

```text
Python Debug
```

Its **Run ▶** action starts the debugger directly.

This is the clearest debugging workflow for users.

### Python Task Build Action

The regular **Python** Task Template also resolves the **Build 🔨** action to the Python debugger when a `.py` file is focused.

Therefore:

```text
Python → Run ▶
```

runs Python normally, while:

```text
Python → Build 🔨
```

starts debugging.

Both workflows use the same underlying `debugpy` debug action.

---

## Jupyter Workflow

When an `.ipynb` file is focused, the Python task's Run action launches:

```bash
/usr/bin/env jupyter lab
```

The working directory is set to the directory containing the focused notebook.

Conceptually:

```javascript
function createJupyterRunAction(filePath) {
	return new TaskProcessAction(
		"/usr/bin/env",
		{
			args: [
				"jupyter",
				"lab"
			],

			cwd:
				nova.path.dirname(filePath)
		}
	);
}
```

This allows the Jupyter server to start from the location where the notebook is actually stored.

---

## Jupyter Build Behavior

The **Build 🔨** action is intended for Python debugging.

Therefore, if Build is invoked while an `.ipynb` file is focused, the extension intentionally rejects the action and displays:

```text
The hammer is for debugging Python .py files. Use ▶ Run to start JupyterLab.
```

This behavior is currently intentional.

A future version may refine the task design further.

---

## Python Task Template

The Python task is declared in `extension.json`.

Conceptually:

```json
"taskTemplates": {
	"python": {
		"name": "Python",
		"description": "Run Python, debug Python, or launch JupyterLab based on the focused file.",
		"tasks": {
			"build": {
				"resolve": "python-smart"
			},
			"run": {
				"resolve": "python-smart"
			}
		}
	}
}
```

Because this is a Nova Task Template, users may need to add the **Python** task to individual projects through:

```text
Project → Project Settings → Tasks → +
```

The dynamically supplied **Python Debug** task behaves differently and can appear automatically.

---

## Task Assistant

The extension registers a Task Assistant with the identifier:

```text
python-smart
```

Conceptually:

```javascript
nova.assistants.registerTaskAssistant(
	new PythonSmartTaskAssistant(),
	{
		identifier:
			"python-smart",

		name:
			"Python"
	}
);
```

The assistant handles both:

```text
Task.Run
```

and:

```text
Task.Build
```

depending on the focused file and selected task.

---

## Focused File Tracking

Nova task execution may occur after focus has moved away from the editor.

To make the workflow more reliable, the extension remembers the last focused document path.

A small interval periodically calls:

```javascript
rememberFocusedFile();
```

The remembered path is then used when resolving task actions.

When modifying this behavior, ensure that:

- the active document path is valid
- stale paths do not accidentally launch the wrong file
- task execution remains predictable
- the timer is disposed when the extension deactivates

---

## Extension Activation

For development, open the `.novaextension` project in Nova and choose:

```text
Extensions → Activate Project as Extension
```

This activates the local development version.

This is different from installing the published Extension Library version.

When testing unpublished changes, verify that the development version is active before drawing conclusions from test results.

---

## Development Requirements

A contributor should have:

```text
Nova
Python 3
debugpy
JupyterLab
Git
```

Verify Python:

```bash
python3 --version
```

Verify `debugpy`:

```bash
python3 -m debugpy --version
```

Verify Jupyter:

```bash
jupyter --version
```

If required:

```bash
python3 -m pip install debugpy
python3 -m pip install jupyterlab
```

---

## Manual Test Plan

Before submitting a release, test the following workflows.

| Test | Expected Result |
| --- | --- |
| `.py` file → Python → Run ▶ | Focused Python file executes |
| `.py` file → Python Debug → Run ▶ | Nova debugger starts |
| `.py` file → Python → Build 🔨 | Nova debugger starts |
| Breakpoint on executable line | Debugger stops at breakpoint |
| `.py` file outside `Python` folder | Run works |
| `.py` file outside `Python` folder | Debugging works |
| `.ipynb` → Python → Run ▶ | JupyterLab launches |
| `.ipynb` outside `Jupyter` folder | JupyterLab still launches |
| `.ipynb` → Python → Build 🔨 | Intentional explanatory error |
| Unsupported file focused | Clear unsupported-file error |

Do not publish a release until Python Run, Python Debug, and Jupyter have all been tested successfully.

---

## Portable Test

A useful portability test is to create:

```text
Project/
├── portable_test.py
└── portable_notebook.ipynb
```

with neither file located inside dedicated `Python` or `Jupyter` folders.

Example Python file:

```python
print("Portable Python test works")
```

Test both:

```text
Python → Run ▶
```

and:

```text
Python Debug → Run ▶
```

The Python file should work in both cases.

Then focus `portable_notebook.ipynb` and test:

```text
Python → Run ▶
```

JupyterLab should launch from the notebook's actual containing directory.

---

## Debugging the Extension

If the extension behaves unexpectedly, inspect Nova's:

```text
Extension Console
```

Look for errors associated with:

```text
Python Run and Debug
```

Useful areas to investigate include:

```text
Task resolution
Focused-file detection
Process launch failures
debugpy adapter failures
Jupyter command resolution
JavaScript exceptions
```

---

## Manifest Validation

`extension.json` must always contain valid JSON.

Be particularly careful with:

```text
commas
quotation marks
property types
accidental characters
version numbers
```

A single stray character can prevent Nova from reading the extension bundle.

Before submitting, visually inspect the manifest and use Nova's submission validation.

---

## Versioning

Every published Nova Extension Library update must use a version newer than the currently published version.

For example:

```text
1.5
1.6
1.7
```

Never attempt to publish another build using a version number that is already live.

Update the version in:

```text
extension.json
```

and add the corresponding release notes to:

```text
CHANGELOG.md
```

before submission.

---

## Release Checklist

Before publishing a new release:

```text
1. Finish and save all source changes
2. Test Python Run
3. Test Python Debug
4. Test breakpoints
5. Test Python Build debugging
6. Test Jupyter Run
7. Test Python outside a Python folder
8. Test Jupyter outside a Jupyter folder
9. Update README.md if behavior changed
10. Update HELP.md if setup or troubleshooting changed
11. Update CONTRIBUTING.md if architecture changed
12. Update CHANGELOG.md
13. Increase the version in extension.json
14. Validate extension.json
15. Stage all Git changes
16. Commit
17. Push to the repository
18. Submit the extension update through Nova
19. Install or update the published version
20. Perform one final sanity test
```

The recommended Git order is:

```text
Stage All
→ Commit
→ Push
→ Submit to Extension Library
```

Git publication and Nova Extension Library submission are separate operations.

---

## Commit Messages

Use concise commit messages that describe the release or change.

Examples:

```text
Improve Python interpreter detection

Fix Jupyter working directory handling

Update debugging documentation

Release version 1.7 with corrected extension metadata
```

Avoid vague commit messages such as:

```text
update

fix

changes
```

when a more descriptive message is possible.

---

## Pull Requests

Contributions should remain focused on the purpose of the extension.

Before proposing a change:

```text
Test the affected workflow
Avoid unrelated refactoring
Keep documentation accurate
Explain behavior changes clearly
Include reproduction steps for bug fixes
```

Changes affecting Python execution, debugging, or Jupyter should be tested against all relevant workflows before being proposed.

---

## Coding Guidelines

Prefer code that is:

```text
Readable
Predictable
Easy to debug
Compatible with Nova's extension APIs
Independent of unnecessary hard-coded installation paths
```

Avoid hard-coding a specific user's home directory or Python installation path.

For external executables, environment-based command resolution is preferred unless a future interpreter-selection system intentionally provides a configured executable path.

---

## Planned Development Areas

Future improvements may include:

```text
Better virtual-environment support
Selectable Python interpreters
Project-specific interpreter configuration
Improved environment detection
Additional Jupyter workflow refinements
More installation-method compatibility testing
Improved task user experience
```

Any implementation should preserve the extension's main principle:

> Running and debugging the currently focused Python file should remain simple.

---

## Security and Permissions

The extension currently requests Nova's subprocess entitlement because Python, `debugpy`, and Jupyter must be launched as external processes.

Do not add new entitlements unless a feature genuinely requires them.

If a new permission is introduced:

```text
Document why it is required
Update README.md
Update HELP.md if appropriate
Mention it in CHANGELOG.md
```

Keep permissions as limited as practical.

---

## Documentation Philosophy

Documentation should be separated by audience.

### README

For users deciding whether to install or use the extension.

### HELP

For users who need setup instructions or troubleshooting.

### CONTRIBUTING

For developers who want to understand, test, modify, or contribute to the project.

### CHANGELOG

For users who want to know what changed between releases.

Avoid placing large amounts of implementation detail in the README when that information belongs here.

---

## Bug Reports

Issues and feature requests can be submitted at:

https://github.com/utkarsh-data-enthusiast/nova-python-debug-current-file/issues

When reporting a problem, useful information includes:

```text
macOS version
Nova version
Python version
Python installation method
debugpy version
Jupyter version
Focused file type
Selected Nova task
Relevant Extension Console output
Reproduction steps
```

---

## Repository

Source code:

https://github.com/utkarsh-data-enthusiast/nova-python-debug-current-file

---

## License

Python Run and Debug is released under the **MIT License**.

By contributing to this project, you agree that your contributions may be distributed under the same license.

See:

```text
LICENSE
```

for the complete license text.

---

## Maintainer

**PatriotEver Lab**