# Python Run and Debug — Help

Use this page for setup, usage, and troubleshooting.

## Quick Start

### Run a Python file

1. Open or focus a `.py` file in Nova.
2. Select the **Python** task.
3. Click **Run ▶**.

The extension runs the currently focused Python file using `python3`.

---

### Debug a Python file

1. Open or focus a `.py` file.
2. Add one or more breakpoints in Nova's editor gutter.
3. Select **Python Debug**.
4. Click **Run ▶**.

Nova starts a debugging session using `debugpy`.

You can also select the **Python** task and use the **Build 🔨** action to start debugging.

---

### Launch JupyterLab

1. Open or focus an `.ipynb` notebook.
2. Select the **Python** task.
3. Click **Run ▶**.

JupyterLab launches using the notebook's containing folder as its working directory.

The notebook does not need to be inside a folder named `Jupyter`.

---

## Requirements

The following commands must be available through your system environment:

```bash
python3 --version
python3 -m debugpy --version
jupyter --version
```

Required tools:

- `python3`
- `debugpy`
- `jupyter` / JupyterLab

---

## Adding the Python Task

The **Python** task is provided as a Nova Task Template.

To add it to a project:

1. Open **Project → Project Settings**
2. Select **Tasks**
3. Click the **+** button
4. Select **Python**

The **Python Debug** task is provided dynamically by the extension and does not need to be manually created.

---

## Troubleshooting

### Run button is disabled

Check that:

- the extension is installed and enabled
- the **Python** task has been added to the project
- a `.py` or `.ipynb` file is focused
- the currently selected task is appropriate for the focused file

If you are testing a local development copy of the extension, make sure the extension project has been activated using:

**Extensions → Activate Project as Extension**

---

### Python cannot be found

Open Terminal and run:

```bash
python3 --version
```

If the command is unavailable, install Python and ensure `python3` is available through your system environment.

The extension does not rely on a hard-coded Python installation path.

---

### debugpy cannot be found

Check whether `debugpy` is available:

```bash
python3 -m debugpy --version
```

If `debugpy` is missing, install it into the Python environment used by `python3`:

```bash
python3 -m pip install debugpy
```

Then verify again:

```bash
python3 -m debugpy --version
```

---

### Jupyter cannot be found

Check whether Jupyter is available:

```bash
jupyter --version
```

If it is unavailable, install JupyterLab into the Python environment you want to use:

```bash
python3 -m pip install jupyterlab
```

Then verify:

```bash
jupyter --version
```

---

### Jupyter Build Failed message

The **Build 🔨** action is reserved for debugging Python `.py` files.

When an `.ipynb` file is focused, use:

**Python → Run ▶**

to launch JupyterLab.

This behavior is intentional.

---

### Wrong Python interpreter

The current release resolves `python3` through the user's system environment.

This makes the extension independent of one fixed Python installation path.

More advanced interpreter and virtual-environment selection is planned for a future update.

---

### Breakpoint is not reached

Check that:

- the breakpoint is placed on executable Python code
- the focused file is the file you intend to debug
- `debugpy` is installed in the Python environment used by `python3`
- you started either the **Python Debug** task or the **Python → Build 🔨** action

---

### Python Debug task is available but Python task is missing

The two tasks are provided differently.

**Python Debug** is provided dynamically by the extension.

The **Python** task is a Nova Task Template and must be added to each project where you want to use it:

1. Open **Project → Project Settings**
2. Select **Tasks**
3. Click **+**
4. Add **Python**

---

### Python or Jupyter file is outside its usual folder

That is supported.

Python files do **not** need to be inside a folder named:

```text
Python
```

Jupyter notebooks do **not** need to be inside a folder named:

```text
Jupyter
```

The extension detects supported files by their extensions:

- `.py` → Python
- `.ipynb` → Jupyter

---

## Extension Console

For development or extension-level errors, open Nova's **Extension Console** and look for messages from:

**Python Run and Debug**

The Extension Console can help diagnose:

- task-resolution errors
- extension activation errors
- JavaScript errors
- debugging setup problems

---

## Supported Workflows

| Feature | Status | Action |
| --- | --- | --- |
| Python file execution | ✅ Supported | **Python → Run ▶** |
| Python debugging | ✅ Supported | **Python Debug → Run ▶** |
| Python debugging through Build | ✅ Supported | **Python → Build 🔨** |
| Breakpoints | ✅ Supported | Nova editor gutter |
| `debugpy` integration | ✅ Supported | Native Nova debugger |
| JupyterLab launching | ✅ Supported | **Python → Run ▶** on `.ipynb` |
| Python files outside `Python` folder | ✅ Supported | Automatic |
| Notebooks outside `Jupyter` folder | ✅ Supported | Automatic |
| Environment-based `python3` resolution | ✅ Supported | `/usr/bin/env` |
| Environment-based `jupyter` resolution | ✅ Supported | `/usr/bin/env` |
| Advanced interpreter selection | 🔧 Planned | Future update |
| Virtual-environment selector | 🔧 Planned | Future update |

---

## Permissions

### Launch Subprocesses

Python Run and Debug requires Nova's **Launch Subprocesses** permission.

This permission is used to launch:

- `python3`
- `debugpy`
- `jupyter`

The extension does not require general filesystem read/write access for its current task functionality.

---

## Bug Reports

Bug reports and feature requests can be submitted through the extension's **Bug Reports** link in Nova's Extension Library.

GitHub Issues:

https://github.com/utkarsh-data-enthusiast/nova-python-debug-current-file/issues

---

## Repository

Source code:

https://github.com/utkarsh-data-enthusiast/nova-python-debug-current-file

---

## License

Python Run and Debug is released under the **MIT License**.

See the `LICENSE` file included with the extension.

---

## Author

**PatriotEver Lab**