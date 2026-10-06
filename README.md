# Python Debug Current File

Python Debug Current File is a Nova task extension for running and debugging Python files directly from Nova.

It also provides JupyterLab launching support for Jupyter Notebook (`.ipynb`) files.

## Debugging in Action

The extension can run and debug the currently focused Python file using Nova's native debugging interface and `debugpy`.

![Python Debug Current File debugging demo](https://raw.githubusercontent.com/utkarsh-data-enthusiast/nova-python-debug-current-file/main/python-debug-demo.png)

## Features

- Run the currently focused Python `.py` file
- Debug Python files with breakpoint support
- Debug using Nova's native debugging interface and `debugpy`
- Launch JupyterLab for `.ipynb` notebook files
- Work with Python and Jupyter files located anywhere in the Nova project
- Resolve `python3` and `jupyter` through the user's system environment
- Integrate with Nova's Run and Build task actions
- Provide a dedicated **Python Debug** task for direct debugging

## Requirements

The following tools must be available on your Mac:

- `python3` for running Python files
- `debugpy` installed in the Python environment used by `python3`
- `jupyter` / JupyterLab for notebook support

The extension resolves Python and Jupyter through your system environment, so it does not depend on a specific Python installation path.

### Verify your setup

You can verify the required commands in Terminal:

```bash
python3 --version
python3 -m debugpy --version
jupyter --version
```

Python may be installed using the official Python installer, Homebrew, pyenv, Conda, or another method, provided `python3` is available through your environment.

## Setup in Nova

### Add the Python task

The **Python** task is provided as a Nova Task Template.

For a project where you want to use it:

1. Open **Project → Project Settings**
2. Go to **Tasks**
3. Click the **+** button
4. Add the **Python** task provided by this extension

The **Python Debug** task is provided dynamically by the extension and can be used directly for debugging.

## Usage

### Run a Python file

1. Open or focus any `.py` file in Nova.
2. Select the **Python** task.
3. Click the **Run ▶** button.

The extension runs the currently focused Python file using `python3`.

The file does not need to be inside a folder named `Python`.

### Debug a Python file

You can debug a Python file in either of these ways.

#### Python Debug task

1. Open or focus the `.py` file you want to debug.
2. Add one or more breakpoints in Nova's editor gutter.
3. Select **Python Debug** from the task menu.
4. Click **Run ▶**.

Nova starts a debugging session using `debugpy`.

#### Python task Build action

You can also:

1. Open or focus a `.py` file.
2. Select the **Python** task.
3. Click the **Build 🔨** button.

For Python files, the Build action starts the debugger.

## Jupyter

To launch JupyterLab:

1. Open or focus an `.ipynb` file.
2. Select the **Python** task.
3. Click **Run ▶**.

The extension launches JupyterLab with the notebook's containing folder as the working directory.

The notebook does not need to be inside a folder named `Jupyter`.

### Jupyter and the Build button

The **Build 🔨** action is reserved for debugging Python `.py` files.

If Build is used while an `.ipynb` file is focused, the extension displays a message telling you to use **Run ▶** to launch JupyterLab instead.

This behavior is intentional.

## Current Status

Python Debug Current File now resolves `python3` and `jupyter` through the user's system environment instead of relying on a fixed Python installation path.

Python `.py` files and Jupyter `.ipynb` notebooks can be used from any folder in the Nova project. Folders do not need to be named `Python` or `Jupyter`.

The current version has been tested successfully for:

- Running Python files
- Debugging Python files with breakpoints
- Debugging with `debugpy`
- Launching JupyterLab from `.ipynb` files
- Running Python files outside a dedicated `Python` folder
- Debugging Python files outside a dedicated `Python` folder
- Launching notebooks outside a dedicated `Jupyter` folder

## Planned Improvements

- Better virtual-environment and interpreter selection
- Additional compatibility testing across Python installation methods
- Further task workflow refinements
- Further Jupyter workflow refinements

## Issues and Feedback

Bug reports and feature requests can be submitted through the GitHub Issues page linked from this extension's repository.

A private support email is also included in the extension's bug-reporting metadata.

## Source Code

The source code for Python Debug Current File is available through the **Repository** link in Nova's Extension Library listing.

## Author

**PatriotEver Lab**