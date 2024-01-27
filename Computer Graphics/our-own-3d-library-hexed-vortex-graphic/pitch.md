## Description

This calming picnic scene is a basis or background asset for a world-building game where users get to interact and control everything in the world around them via buttons.

### Autonomously Animated

- The bird in the tree pokes its head out of the tree at regular intervals to check the weather!
- The clouds bounce back and forth at 1/5th the speed of light!

### Interactive

- Users can add and remove clouds from scene by clicking the "Add Coud" and "Remove Clouds" buttons.
- Users can open and close the picnic basket by clicking the "toggle basket" button.
- Users can remove the bird from the tree's group by clicking the "toggle bird".

### We have the tech 💡

- Ability to change camera position and viewpoint
  - Click "Move Camera" to move the camera around the scene in a circle.
- Ability to toggle between wireframe and solid rendering
  - Implemented and user can toggle between wireframe and solid by clicking the "Toggle wireframe" button.
- Ability to toggle between orthographic and perspective projection (you may choose the viewing volume parameters as appropriate for each type of projection)
  - Click "Toggle Orthographic Projection" to switch between orthographic and perspective projection.
- A non-square canvas whose aspect ratio matches that of both viewing volumes
  - We changed the canvas dimensions to be a rectangular canvas--it should work with whatever dimensions the canvas is set to in PitchedScene.
- Ability to add and remove objects to/from the scene
  - Adding and removing clouds by clicking the "Add Coud" and "Remove Clouds" buttons.
- Ability to add and remove objects to/from groups
  - The user can add and remove a bird from the tree group by clicking "Toggle bird"
- Ability to compute lighting in both faceted/flat and smooth styles
  - Clouds are smooth
  - Everything else is faceted
