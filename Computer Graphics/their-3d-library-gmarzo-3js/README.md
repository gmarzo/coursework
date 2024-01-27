**CMSI 3710** Computer Graphics, Spring 2023

# Assignment 0208
We start our computer graphics journey by learning how to do it through a higher-level library that is made by someone else—in this case [three.js](https://threejs.org). The spirit of this assignment is very much “have fun and see what you can do,” under the premise that in doing so, you’ll start learning some core computer graphics concepts.

## Background Reading
As noted on the course website, most of our source material for working with “their” library is the [documentation of that library itself](https://threejs.org/manual/#en/fundamentals). After you get the basics, expanding your knowledge becomes a matter of getting to know the various geometries and materials that are available to you. You will then primarily want to learn about [Object3D](https://threejs.org/docs/api/en/core/Object3D.html)—so that you get to know the range of things that most scene objects have in common—and [Group](https://threejs.org/docs/api/en/objects/Group.html)—so that you can put together multiple objects in a way that lets them behave as a single, composite object.

Finally, _helper_ objects are available for “breaking the fourth wall” (and for understanding what’s going on in a visual way). Helpers provide supplementary objects to your scene to help you see [axes](https://threejs.org/docs/index.html#api/en/helpers/AxesHelper) or [cameras](https://threejs.org/docs/index.html#api/en/helpers/CameraHelper), to name a few.

The [Custom BufferGeometry page](https://threejs.org/manual/#en/custom-buffergeometry) will be of most direct use for custom geometry creation, alongside the accompanying [BufferGeometry reference page](https://threejs.org/docs/#api/en/core/BufferGeometry) for deeper-dive details and functions.

Finally, in addition to the standard [Materials](https://threejs.org/manual/#en/materials) that you are likely to use for a scene, you may find it useful to temporarily switch to [MeshNormalMaterial](https://threejs.org/docs/#api/en/materials/MeshNormalMaterial) for quick, easy visualization of a geometry’s normal vectors (we’ll talk about those more in class).

A more conceptual take on [3D Object Modeling](http://dondi.lmu.build/share/cg/3d-object-models-v03.pdf) can also be found on the course website.

### Mathematical/Theoretical Foundations Preview
The concepts that we are discovering via three.js are addressed in less technology-specific (but more mathematical) terms in the [Shirley book](https://brightspace.lmu.edu/d2l/le/content/201513/viewContent/2379422/View). These may be hard to read right now because Shirley doesn’t separate the concept from the theory—the book alternates between describing an idea then dives right into the mathematics for implementing that idea. However, if you want a taste of how three.js does what it does under the hood, give these a scan:
- Meshes and scenes: Sections 12.1–12.3
- Animation and motion: Sections 17.1–17.5
- Approaches to interaction: Chapter 19

### Side Trip: Tweened Animation and Easing Functions
Completely supplementary, with the addition of the [createjs/TweenJS](https://www.createjs.com/tweenjs) library to the sample code, are the following readings on _tweened animation_—the technique of automatically calculating intermediate positions based on a starting and ending value. The recognized pioneer and expert here is Robert Penner, who has released his [book chapter on tweening and easing](http://robertpenner.com/easing/penner_chapter7_tweening.pdf) for free on the web. There is also Gilmore Davidson’s online presentation called [Ease Yourself Into Animation](https://gilmoreorless.github.io/sydjs-preso-easing/)—although some of its code/technology references are dated, the core concepts and presentation approach remain pretty solid. Finally, TweenJS provides a [visual demonstration](https://www.createjs.com/demos/tweenjs/tween_sparktable) of its tweening functions—and of course, you can always write your own.

## For Submission
To starting learning how to build our own 3D graphics library, we need to first (a) learn some 3D graphics concepts and (b) see how _other_ people have approached making a 3D graphics library. So we start by creating a three-dimensional scene implemented via three.js. To keep the scene from being too open-ended (which paradoxically may limit your creativity or productivity), the following criteria must be met by the scene:

### Have a Pitch
Give the scene a concrete _use case_—in other words, don’t let it be a meaningless collection of objects (the way the starter code is 😅). To that end, supply a _pitch.md_ file that frames your scene in some context. Is it the beginnings of a story? The basis for a game? The foundation for a simulation? Setting up a pitch that excites your entire group will seed your ideas and explorations.

Note the use of words like “beginning,” “basis,” or “foundation”—the final result of this assignment doesn’t need to be fully-formed. However, it must be _self-sufficient_: i.e., it might not be feature-complete, but the features that _are_ present are functional and bug-free.

In any case, make sure your idea fits well with the technical requirements listed below. You’ll want use cases that naturally/organically benefit from having autonomous animation, interaction, lights, textures, adding/removing objects, collision detection, and custom geometries. Does this call for some thinking and planning? Yes, of course. So be creative, brainstorm with your group, and come up with something that everyone can be excited about.

### Keep Some Motion in the Ocean
The scene must have something that is _autonomously animated_—i.e., one or more things about the scene must change over time even if the user does nothing. This animation must be described in _pitch.md_. (so I know that it is intended behavior)

### Give the User Something to Do
Conversely, the scene must also have something that is _interactive_—i.e., the user can perform one or more actions that will affect the scene dynamically. Instructions for this interactivity should be described in _pitch.md_. (so I know what to do when I fire up your scene)

This interaction criterion can be integrated with other specifications in the assignment (particularly [The Hokey-Pokey](#the-hokey-pokey))—just make sure that something happens as a consequence of the user’s action and you’ll be all set. Again, keep with the spirit of your vision and don’t just throw something in there.

_Your autonomous animations and interactivity must be **different** from the ones already demonstrated in the starter code. (I hope that needs no explanation!)_

### Lights and Textures
Give your scene an appropriate lighting scheme; use materials that respond to light; and texture-map at least three (3) objects in your scene.

#### Academic Honesty Alert!
Make sure to acknowledge the sources of any textures that you use—a comment in the code near the place where you use the texture image will suffice.

### [The Hokey-Pokey](https://www.youtube.com/watch?v=pJjgxXCkMYk)
Implement the following very common behaviors as either autonomous animation or user interaction. These can be implemented as separate use-case-level features or integrated into one Dazzling Display of Three-Dimensional Derring-Do.

These behaviors may benefit from some preset animations, but as you might have realized, programming those into the `animate` function can get very labor-intensive. To lessen this tedium, a helper library called [TweenJS](https://www.createjs.com/tweenjs) is installed by the starter code. The library makes animation code more declarative and also allows concurrent independent animations to take place. This doesn’t really help with the specific behaviors here but may make for some entertaining visuals _upon_ performing those behaviors.

#### “You Put an Object In, You Take an Object Out…”
Implement _dynamic_ addition and removal of meshes or groups to/from your scene, either via autonomous animation or user interaction. In other words, don’t just set up your scene and let it go; come up with a scenario which requires that an object be added to your scene in the middle of the action. Have another scenario that removes an object as well—perhaps the same object that was added previously.

As always, the addition and removal must make sense in the context of your overall use case, so do make sure to tailor your use case such that these actions are a natural part of your pitch. Examples include autonomous objects that enter or leave the scene at random or having a user manually add or remove objects at will. Maybe projectiles are launching from somewhere then disappear when they hit the ground (see the next behavior). Or perhaps you have a naturalistic setting where plants grow or animals emerge. In any case, make sure that your scene graph doesn’t stay fixed for the life of your application.

Document your addition and removal behavior in _pitch.md_ so that it’s clear that the behavior is intentional.

#### “…And You Shake it All About…”—Crash and Learn
Implement at least one instance of _collision detection_—i.e., a behavior where contact between two objects in the scene changes what is currently going on. The collision may be a result of autonomous animation or user interaction. For example, you might have an independently-moving object that changes direction when it hits something. Alternatively, the user might be able to get objects to change color or texture when they touch. Or finally, perhaps your scene has a genuine “floor” and objects do not fall past it.

The collision implementation must genuinely result from detecting some kind of contact between the objects. In other words, don’t “fake” a collision through hardcoded thresholds or scripted animations that are pre-programmed to just happen to look like objects interacting with each other. The detection mechanism doesn’t need to be very sophisticated—as you might guess, [fully generalized object interaction](https://en.wikipedia.org/wiki/Rigid_body_dynamics) can be quite involved. When the objects themselves are pliable, elastic, or fluid, things get even more gnarly. That isn’t what’s expected here: keep it simple.

Not all objects have to be interactive in this way—again, that’s a general case which is beyond the scope of this assignment. Just pick a subset and build your logic around those. The rest of the scene can go on ignoring each other 🧐

As mentioned earlier, you may also combine all of these behaviors into one meaningful scenario for your use case. For example, a collision might remove the collided object from the scene. Alternatively, a collision may add new objects. That approach will satisfy these technical requirements just fine.

Document your collision behavior in _pitch.md_ so that it’s clear the behavior is intentional.

### Build Something to Call Your Own
Each individual member of the group must be clearly in charge of or responsible for at least one “character” or object in the scene. The group can collaborate on it but a specific member must have primary responsibility for that object. Concretely speaking, the majority of commits for that character or object’s code must be by the responsible member.
* Document the distribution of responsibility by providing a _credits.md_ file stating which character or object was the primary responsibility of which member
* Not all scene objects have to be individual—some aspects may be fully shared by the group. But each member must be in charge of at least one. This ensures that your scene will have, at a bare minimum, at least as many characters/objects as you have group members
* Practice on your own! Each group member should acquire their own [three.js playground](https://classroom.github.com/a/N5pmbzsH) and do some individual experimentation/learning. _Commit work to the playground_ to document that you did spend some time on this. If you follow along in class, you will have already done this—so that pays off here!
* Each group member’s character must have a _composite_ aspect: i.e., it should be internally made of more than one mesh, but can be manipulated or operated on as if it were a single object (_cough cough_ [Group](https://threejs.org/docs/api/en/objects/Group.html) _cough cough_ …or if you’re a little more adventurous, look at [Skeleton](https://threejs.org/docs/index.html#api/en/objects/Skeleton))
* As such, simple elements such as a flat planes, spheres, cubes, or other single-mesh aspects should be shared group responsibilities. Don’t take individual credit for any of those—they’re too simple!

### Bespoke for Yourself: Make Your Own Geometry
In addition to having a composite ([Group](https://threejs.org/docs/#api/en/objects/Group)/[Skeleton](https://threejs.org/docs/#api/en/objects/Skeleton)) aspect, your individual-responsibility object must also include a mesh with _a custom geometry_. In addition to the documentation linked above, the starter code in this repository provides a simple example for such a beast.

To avoid just any scattershot conglomeration of randomized vertices, your customized mesh should have the following characteristics:
* It must be informed by your pitch—avoid a custom geometry for the sake of it; think through your use case and your object, and come up with a custom geometry that fits well with them
* It must not be easily replicable through any single pre-made geometry nor through straightforward translation, rotation, or scaling of these shapes (watch out—the extrude and lathe geometries can be surprisingly flexible)
* It must have at least six (6) non-coplanar triangles (in case that seems intimidating: note that this is on the same level as a cube)
* It must make an appropriate choice between a faceted look (e.g., cubes, polyhedra, etc.) and a smooth look (e.g., spheres, cylinders, cones, etc.)
* It must have at least one of the following:
    * Per-vertex texture coordinates (demonstrable by using a `map` with your material)
    * Per-vertex colors (demonstrable by setting `vertexColors: true` on your material)

Note that although the end product is almost always the same—arrays of vertices, colors, texture coordinates—_how_ those arrays are built can vary widely. You can flat-out just list the numbers—not a bad exercise in limited amounts, but doesn’t scale well; that’s why we have 3D modeling applications and scanners! You can have some base values then generate the rest algorithmically. You can have a fixed set of vertices then programmatically arrange/copy/index them as needed. Or you can go fully computational and calculate something based on some set of parameters. A level of randomization may be appropriate…but don’t get completely random.

### Bells and Whistles…
The technical specifications of this assignment are meant to introduce you to the main building blocks that power most entry-to-mid-level 3D applications. After this assignment, we will go under the hood to see how these basics are implemented.

What’s left? Within reach are [shadows](https://threejs.org/manual/#en/shadows) and [fog](https://threejs.org/manual/#en/fog). For interaction, you can look into [3D picking](https://threejs.org/manual/#en/picking). For modeling, you can look into [skeletons](https://threejs.org/docs/#api/en/objects/Skeleton) with a [skinned mesh](https://threejs.org/docs/#api/en/objects/SkinnedMesh). And finally, you can look ahead by exploring [ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial)—a material where you directly program vertex and coloring calculations.

#### …But Set your Priorities
Feel free to explore, but once again, don’t obligate yourself to go there. You will not get extra credit—for this assignment—for implementing technologies that fall outside the scope of what is described above. You can go there, but if you do, do it solely because you’re interested or want to try things out for the sake of trying things out. We will expand to them in later assignments.

A meticulously rendered 3D model with shadows built on a skeleton that just sits there doing nothing will get a lower grade than a moving, dynamic scene consisting of cubes, spheres, and cones. You _may_ implement such bells and whistles, but for this assignment, do them because you _want_ to and not because you intend to bump up your grade.

## Operational Directives/Suggestions
- The starter code has a preliminary organization and structure, and is also provided as a React app—you may modify any or all of these. The only condition is that you deliver a standalone web application that uses three.js. Of course, if you move away from a React app, make sure you provide clear and complete documentation on how to get your scene to run
- Don’t let the “characters are an individual responsibility” aspect throw you off from working on the _entire_ scene as a group. By and large, a group that works effectively together will have the most successful scene. The individual character aspect merely lets each group member have something they can call their own, reflecting individual interests and emphasis. By all means still collaborate with each other on your characters—help each other, within reason, to bring their best to the overall scene
- Although you are asked to commit work to an individual three.js playground where you can try things out, make sure to isolate that work only to experiments and exploration. Any work that now directly stems from what your group decides for your scene should be done _on your group repository_ so that all commits are reported there. Doing work on the individual playground then copying files wholesale to the group repository only loses the granularity and incremental changes that you make along the way

## How to Turn it In
Commit the following to your team repository (this one):
* The complete scene code, organized such that individual-responsibility characters/objects are in clearly-indicated distinct files or folders
* _pitch.md_, including your use case and descriptions of addition, removal, and collision behaviors
* _credits.md_, listing the characters/objects that are individually owned
* If needed, instructions for how to run your scene (if it is no longer a React app)

Commit the following to individual three.js playground repository:
* Experimental/exploratory work that you did to learn three.js, prior to “officially” working on your character/object and geometry on the team repository

## Specific Point Allocations
This assignment is scored according to outcomes _1b_, _1c_, _2a_–_2c_, _3a_, _3c_, and _4a_–_4f_ in the [syllabus](http://dondi.lmu.build/spring2023/cmsi3710/cmsi3710-spring2023-syllabus.pdf). For this particular assignment, graded categories are as follows:

| Category | Points | Outcomes |
| -------- | -----: | -------- |
| [_pitch.md_](#have-a-pitch) provides all requested information | 10 points total | _1c_, _3a_, _3c_, _4b_, _4c_ |
| • Description of use case | 2 points | |
| • Description of autonomous animation | 2 points | |
| • Interaction documentation | 2 points | |
| • Description of addition/removal behavior | 2 points | |
| • Description of collision detection behavior | 2 points | |
| [Autonomous animation](#keep-some-motion-in-the-ocean) meets specifications | 7 points total | _2a_, _2b_, _3c_, _4a_–_4d_ |
| • Aligns with use case | 2 points | |
| • Differs from startup code | deduction only | |
| • Implemented correctly and well | 5 points | |
| [User interaction](#give-the-user-something-to-do) meets specifications | 7 points total | _2a_, _2b_, _3c_, _4a_–_4d_ |
| • Aligns with use case | 2 points | |
| • Differs from startup code | deduction only | |
| • Implemented correctly and well | 5 points | |
| [Lights and textures](#lights-and-textures) are implemented | 12 points total | _2c_, _4a_–_4d_ |
| • Well-chosen lights are included in the scene | 3 points | |
| • Scene objects use materials that use lights | 3 points | |
| • At least three (3) objects use texture mapping | 6 points | |
| • Texture creators/sources are acknowledged | deduction only | |
| Some objects get [added to the scene on the fly](#you-put-an-object-in-you-take-an-object-out) | 5 points total | _1c_, _4a_–_4d_ |
| • Aligns with use case | 2 points | |
| • Implemented correctly and well | 3 points | |
| Some objects get [removed from the scene on the fly](#you-put-an-object-in-you-take-an-object-out) | 5 points total | _1c_, _4a_–_4d_ |
| • Aligns with use case | 2 points | |
| • Implemented correctly and well | 3 points | |
| Some [collision detection](#and-you-shake-it-all-aboutcrash-and-learn) is implemented | 14 points total | _2a_, _2b_, _3c_, _4a_–_4d_ |
| • Aligns with use case | 2 points | |
| • Logic genuinely uses object positions and state | 7 points | |
| • Implemented correctly and well | 5 points | |
| [Characters/objects meet specifications](#build-something-to-call-your-own) | 40 points total | _1b_, _1c_, _3a_, _3c_, _4a_–_4d_ |
| • Aligns with use case | 2 points | |
| • _credits.md_ lists all group members and what they individually took point on | 5 points | |
| • Exploratory/experimental commits are seen in [individual three.js playgrounds](#build-something-to-call-your-own) | 5 points | |
| • [Individual-responsibility character/object](#build-something-to-call-your-own) uses genuine composition via [Group](https://threejs.org/docs/index.html#api/en/objects/Group) or [Skeleton](https://threejs.org/docs/index.html#api/en/objects/Skeleton) | 5 points | |
| • [Individual-responsibility custom geometry](#bespoke-for-yourself-make-your-own-geometry) is not easily replicable with built-ins | 5 points | |
| • At least six (6) non-coplanar triangles | 6 points |
| • Looks appropriately faceted or smooth | 6 points |
| • Includes and makes use of either texture coordinates or vertex colors | 6 points | |
| Hard-to-maintain or error-prone code | deduction only | _4b_ |
| Hard-to-read code | deduction only | _4c_ |
| Version control | deduction only | _4e_ |
| Punctuality | deduction only | _4f_ |
| **Total** | **100** |

For non-code deliverables, we reinterpret outcomes _4b_ and _4c_ in this assignment to represent the clarity, polish, and effectiveness of how you document your scene and its features.

Note that inability to compile and run any code to begin with will negatively affect other criteria, because if we can’t run your code (or commands), we can’t evaluate related remaining items completely.
