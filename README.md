# ECO - Glaze Engine Entity Component System

Entities are made up of components.  Combinations of components are matched to Views.  One or more view(s) can be associated with a System.  When a compenent is added to a view, all systems that have registered an intrest are notified.  Systems belong to a phase, which affects how often its updated.

Macros are lightly used to:
* Build and inject component names
* Fast component lookup
* Creating constructors (if needed) on components

This would not exist without the work of:
* [Artemis](https://code.google.com/p/artemis-framework/)
* [ASH](https://github.com/richardlord/Ash)
* [EDGE](https://github.com/fponticelli/edge)
* [Flambe](https://github.com/aduros/flambe/)