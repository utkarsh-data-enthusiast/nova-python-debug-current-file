# Python Debug Current File

Python Debug Current File is a Nova task extension for running and debugging Python files directly from Nova.

It also includes Jupyter support for projects that use JupyterLab.

## Features

- Run the currently focused Python file
- Debug Python files with breakpoint support
- Launch JupyterLab for Jupyter-related project files
- Integrates with Nova's Run and Build task actions
- Uses Nova's native task and debugging system

## Requirements

This extension currently expects Python and the required Python tools to already be installed on your Mac.

For debugging, `debugpy` must be available in the Python environment used by the extension.

For Jupyter support, JupyterLab must also be installed.

> Note: The current version is still being improved to support a wider range of Python installations and environments. A future update will improve automatic Python and Jupyter detection.

## Usage

### Run a Python file

1. Open a Python file in Nova.
2. Select the **Python** task.
3. Click the **Run ▶** button.

The extension runs the currently focused Python file.

### Debug a Python file

1. Open the Python file you want to debug.
2. Add breakpoints by clicking in Nova's editor gutter.
3. Start the Python debugging task.
4. Nova will use `debugpy` for the debugging session.

### Jupyter

For supported Jupyter project files, the extension can launch JupyterLab using the configured task behavior.

## Current Status

This extension is actively being improved.

The current release was originally created for a specific Python development setup, so compatibility with every Python installation method is not yet guaranteed.

Planned improvements include:

- Automatic Python executable detection
- Better virtual-environment support
- Improved Jupyter detection
- Cleaner task behavior across different Python setups
- Updated screenshots and documentation

## Issues and Feedback

If you encounter a problem or have a suggestion, please report it through the GitHub issue tracker:

https://github.com/utkarsh-data-enthusiast/nova-python-debug-current-file/issues

## Source Code

The source code is available on GitHub:

https://github.com/utkarsh-data-enthusiast/nova-python-debug-current-file

## Author

**PatriotEver Lab**