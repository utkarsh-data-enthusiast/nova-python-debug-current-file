# Python Debug Current File

Python Debug Current File is a Nova task extension for running and debugging Python files directly from Nova, with JupyterLab launching support for `.ipynb` notebooks.

[![Nova Extension](https://img.shields.io/badge/Nova-Extension-7B61FF)](https://extensions.panic.com/extensions/dev.patriotever/dev.patriotever.pythondebugcurrentfile/)
[![Release](https://img.shields.io/badge/release-v1.8-blue)](https://extensions.panic.com/extensions/dev.patriotever/dev.patriotever.pythondebugcurrentfile/)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Debugging in Action

Debug the currently focused Python file using Nova's native debugging interface and `debugpy`.

![Python Debug Current File debugging demo](https://raw.githubusercontent.com/utkarsh-data-enthusiast/nova-python-debug-current-file/main/python-debug-demo.png)

## Features

- **Run Current Python File:** Execute the currently focused `.py` file directly from Nova.
- **Native Python Debugging:** Debug Python files through Nova's native debugger using `debugpy`.
- **Breakpoint Support:** Add and use breakpoints directly from Nova's editor gutter.
- **Dedicated Python Debug Task:** Start debugging through **Python Debug → Run ▶**.
- **Build-to-Debug Workflow:** Use **Python → Build 🔨** to launch the debugger for `.py` files.
- **JupyterLab Support:** Launch JupyterLab for the currently focused `.ipynb` notebook.
- **Flexible Project Layout:** Python and Jupyter files can be located anywhere in the Nova project.
- **Environment-Based Resolution:** Resolve `python3` and `jupyter` through the user's system environment instead of relying on fixed installation paths.
- **Focused File Detection:** Task behavior automatically adapts to `.py` and `.ipynb` files.

## Feature Status

| Feature | Status | Usage |
| --- | --- | --- |
| Python file execution | ✅ Supported | **Python → Run ▶** |
| Python debugging | ✅ Supported | **Python Debug → Run ▶** |
| Python debugging through Build | ✅ Supported | **Python → Build 🔨** |
| Breakpoints | ✅ Supported | Nova editor gutter |
| `debugpy` integration | ✅ Supported | Nova native debugger |
| JupyterLab launching | ✅ Supported | **Python → Run ▶** on `.ipynb` |
| Python files outside `Python` folder | ✅ Supported | Automatic |
| Notebooks outside `Jupyter` folder | ✅ Supported | Automatic |
| Environment-based `python3` resolution | ✅ Supported | `/usr/bin/env` |
| Environment-based `jupyter` resolution | ✅ Supported | `/usr/bin/env` |
| Advanced interpreter selection | 🔧 Planned | Future update |
| Virtual-environment selector | 🔧 Planned | Future update |

### Status Legend

- ✅ **Supported** — available in the current release.
- 🔧 **Planned** — intended for a future release.

## Requirements

The following tools must be available on your Mac:

- `python3` for running Python files
- `debugpy` installed in the Python environment used by `python3`
- `jupyter` / JupyterLab for notebook support

The extension resolves Python and Jupyter through your system environment, so it does not depend on a specific Python installation path.

### Verify your setup

Run:

```bash
python3 --version
python3 -m debugpy --version
jupyter --version
```

Python may be installed using the official Python installer, Homebrew, pyenv, Conda, or another method, provided `python3` is available through your environment.

## Setup in Nova

### Add the Python task

The **Python** task is provided as a Nova Task Template.

For each project where you want to use it:

1. Open **Project → Project Settings**
2. Select **Tasks**
3. Click the **+** button
4. Add the **Python** task provided by this extension

The **Python Debug** task is provided dynamically by the extension and can be used directly for debugging.

## Usage

### Run a Python file

1. Open or focus any `.py` file in Nova.
2. Select the **Python** task.
3. Click **Run ▶**.

The extension runs the currently focused Python file using `python3`.

The file does not need to be inside a folder named `Python`.

### Debug a Python file

There are two supported debugging workflows.

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
3. Click **Build 🔨**.

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

## Permissions

Python Debug Current File requests only the Nova entitlement required for its current functionality.

### Launch Subprocesses

The extension uses Nova's **Launch Subprocesses** permission to start:

- `python3` for Python execution
- `python3 -m debugpy.adapter` for debugging
- `jupyter lab` for notebook workflows

The extension does not currently request general filesystem, clipboard, or network entitlements.

## Current Status

Python Debug Current File resolves `python3` and `jupyter` through the user's system environment instead of relying on a fixed Python installation path.

Python `.py` files and Jupyter `.ipynb` notebooks can be used from any folder in the Nova project.

The current release has been tested successfully for:

- Running Python files
- Debugging Python files with breakpoints
- Debugging using `debugpy`
- Launching JupyterLab from `.ipynb` files
- Running Python files outside a dedicated `Python` folder
- Debugging Python files outside a dedicated `Python` folder
- Launching notebooks outside a dedicated `Jupyter` folder

## Planned Improvements

- Better virtual-environment support
- Advanced Python interpreter selection
- Additional compatibility testing across Python installation methods
- Further task workflow refinements
- Further Jupyter workflow refinements

## Troubleshooting

A dedicated **Help** page is included with the extension.

Open the extension in Nova's Extension Library and select the **Help** tab for:

- setup instructions
- disabled Run button troubleshooting
- missing `python3`
- missing `debugpy`
- missing Jupyter
- breakpoint troubleshooting
- task setup guidance
- development-extension troubleshooting

## Contributing

Bug reports, compatibility reports, and feature suggestions are welcome.

If you encounter a problem, please include:

- your macOS version
- your Nova version
- your Python installation method
- output from `python3 --version`
- output from `python3 -m debugpy --version`
- output from `jupyter --version`
- the relevant Nova Extension Console error, if available

Use the extension's **Bug Reports** link or GitHub Issues:

https://github.com/utkarsh-data-enthusiast/nova-python-debug-current-file/issues

## Repository

Source code:

https://github.com/utkarsh-data-enthusiast/nova-python-debug-current-file

## License

Python Debug Current File is released under the **MIT License**.

See the included `LICENSE` file for details.

## Author

**PatriotEver Lab**