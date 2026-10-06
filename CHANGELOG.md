## Version 1.6

### Professional Presentation

- Added MIT License metadata and a complete MIT `LICENSE` file.
- Added dedicated Nova Help documentation with setup and troubleshooting guidance.
- Added a professional feature-status table and status legend.
- Expanded README documentation for permissions, troubleshooting, contributing, and supported workflows.
- Added polished Nova Extension, release, and license badges.
- Improved Extension Library presentation and documentation consistency.

## Version 1.5

### Documentation

- Moved the Python debugging demonstration image to the extension root for a cleaner project structure.
- Removed the now-unneeded documentation folder.
- Fixed the debugging demonstration image URL used in the Nova Extension Library Details page.

## Version 1.4

### Portability and Compatibility

- Removed the hard-coded Python 3.14 installation path.
- Python is now resolved through the user's system environment using `python3`.
- Jupyter is now resolved through the user's system environment using `jupyter`.
- Python files no longer need to be inside a folder named `Python`.
- Jupyter notebooks no longer need to be inside a folder named `Jupyter`.
- JupyterLab now launches using the focused notebook's actual containing folder as its working directory.
- Updated task logic to detect Python and Jupyter files by `.py` and `.ipynb` file extensions.

### Python Debugging

- Confirmed Python debugging works outside dedicated Python folders.
- Continued using `debugpy` with Nova's native debugging interface.
- Improved error messages for unsupported or unfocused files.

### Documentation

- Added a real screenshot demonstrating Python debugging with breakpoints, variables, debug output, and `debugpy`.
- Expanded setup instructions for adding the Python Task Template to Nova projects.
- Added clearer Run, Debug, Build, and Jupyter usage instructions.
- Updated requirements to reflect environment-based Python and Jupyter detection.
- Documented the intentional Build behavior for Jupyter notebooks.
- Updated current-status and planned-improvements documentation.

## Version 1.3

### Documentation Improvements

- Replaced the default Nova README template with documentation written specifically for Python Debug Current File.
- Removed the unrelated Playdate screenshot.
- Removed misleading Node.js and NPM requirements.
- Added usage instructions for Python Run, Python Debug, and Jupyter support.
- Added compatibility notes and planned improvements.

## Version 1.2

### Support and Project Links

- Added the public GitHub repository.
- Added GitHub Issues as the primary bug-reporting and feature-request channel.
- Added a private support email address to the extension's bug-reporting metadata.

## Version 1.1

### Initial Release

- Added the smart Python Task Template.
- Added Python file execution from Nova.
- Added Python debugging using `debugpy`.
- Added breakpoint support.
- Added the dedicated Python Debug task.
- Added JupyterLab launching support.
- Added integration with Nova's Run and Build task actions.