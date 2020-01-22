# How to Contribute

## Introduction

Thank you for your interest in contributing! All types of contributions are
encouraged and valued. Please make sure to read the relevant section before
making your contribution. We at the [Durrant Lab](http://durrantlab.com) look
forward to your contributions.

## Reporting a bug

<!-- * **Do not open up a GitHub issue if the bug is a security vulnerability in
  Rails**, and instead to refer to our [security
  policy](https://rubyonrails.org/security/).

* **Ensure the bug was not already reported** by searching on GitHub under
  [Issues](https://github.com/rails/rails/issues). -->

If you're unable to find an open issue addressing the bug, feel free to [open
a new one](https://docs.gitlab.com/ee/user/project/issues/). Be sure to
include a **title and clear description**, as much relevant information as
possible (e.g., the program, platform, or operating-system version numbers),
and a **code sample** or **test case** demonstrating the expected behavior
that is not occurring.

If you or the maintainers don't respond to an issue for 30 days, the issue may
be closed. If you want to come back to it, reply (once, please), and we'll
reopen the existing issue. Please avoid filing new issues as extensions of one
you already made.

<!-- * If possible, use the relevant bug report templates to create the issue.
  Simply copy the content of the appropriate template into a .rb file, make
  the necessary changes to demonstrate the issue, and **paste the content into
  the issue description**:
  * [**Active Record** (models, database)
    issues](https://github.com/rails/rails/blob/master/guides/bug_report_templates/active_record_master.rb)
  * [**Action Pack** (controllers, routing)
    issues](https://github.com/rails/rails/blob/master/guides/bug_report_templates/action_controller_master.rb)
  * [**Generic template** for other
    issues](https://github.com/rails/rails/blob/master/guides/bug_report_templates/generic_master.rb)

* For more detailed information on submitting a bug report and creating an
  issue, visit our [reporting
  guidelines](https://edgeguides.rubyonrails.org/contributing_to_ruby_on_rails.html#reporting-an-issue). -->

## Project setup to make source-code changes on your computer

This project uses `git` to manage contributions, so start by [reading up on
how to fork a `git`
repository](https://docs.gitlab.com/ee/user/project/repository/forking_workflow.html#creating-a-fork)
if you've never done it before.

Forking will place a copy of the code on your own computer, where you can
modify it to correct bugs or add features.

## Integrating your changes back into the main codebase

Follow these steps to "push" your changes to the main online repository so
others can benefit from them:

* Create a [new merge
  request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
  with your changes.

* Ensure the description clearly describes the problem and solution. Include
  the relevant issue number if applicable.

* Before submitting, please read this CONTRIBUTING.md file to know more about
  coding conventions and benchmarks.

## Coding conventions

Be sure to adequately document your code with comments so others can
understand your changes. All classes and functions should have associated doc
strings, formatted as appropriate given the programming language. Here are
some examples:

```python
"""
This file does important calculations. It is a Python file with nice doc strings.
"""

class ImportantCalcs(object):
    """
    An important class where important things happen.
    """

    def __init__(self, vars=None, receptor_file=None,
                 file_conversion_class_object=None, test_boot=True):
        """
        Required to initialize any conversion.

        Inputs:
        :param dict vars: Dictionary of user variables
        :param str receptor_file: the path for the receptor file
        :param obj file_conversion_class_object: object that is used to convert
            files from pdb to pdbqt
        :param bool test_boot: used to initialize class without objects for
            testing purpose
        """

        pass
```

```typescript
/**
 * Sets the curStarePt variable externally. A useful, well-documented
 * TypeScript function.
 * @param {number[]} pt  The x, y coordinates of the point as a list of
 *                       numbers.
 * @returns void
 */
export function setCurStarePt(pt: any): void {
    curStarePt.copyFrom(pt);
}
```

If writing Python code, be sure to use the [Black
formatter](https://black.readthedocs.io/en/stable/) before submitting a merge
request. If writing code in JavaScript or TypeScript, please use the [Prettier
formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

## Fixing whitespace, formatting code, or making a purely cosmetic patch

Changes that are cosmetic in nature and do not add anything substantial to the
stability, functionality, or testability of the program are unlikely to be
accepted.

<!-- #### **Do you intend to add a new feature or change an existing one?**

* Suggest your change in the [rubyonrails-core mailing
  list](https://groups.google.com/forum/?fromgroups#!forum/rubyonrails-core)
  and start writing code.

* Do not open an issue on GitHub until you have collected positive feedback
  about the change. GitHub issues are primarily intended for bug reports and
  fixes. -->

## Asking questions about the program

Ask any question about how to use the program on the appropriate [Durrant Lab
forum](http://durrantlab.com/forums/).

<!-- #### **Do you want to contribute to the Rails documentation?**

* Please read [Contributing to the Rails
  Documentation](https://edgeguides.rubyonrails.org/contributing_to_ruby_on_rails.html#contributing-to-the-rails-documentation). -->

<!-- This program is a volunteer effort. We encourage you to pitch in and join the
team!

Thanks!

Durrant Lab Team -->

## Acknowledgements

This document was inspired by:

* [Ruby on Rails CONTRIBUTING.md
  file](https://raw.githubusercontent.com/rails/rails/master/CONTRIBUTING.md)
  (MIT License).
* [weallcontribute](https://github.com/WeAllJS/weallcontribute/blob/latest/CONTRIBUTING.md)
  (Public Domain License).
