## Commentary

### Assess Your Learnings

1. What aspects of defining a 3D scene are successfully handled by your library behind the scenes?
   - shape creation
   - removing/adding to a scene
   - matrix multiplication
   - rotation/position/scaling of shapes
   - lighting
2. What aspects are not handled behind the scenes? (i.e., the dev user needs to write code for them)
   - Setting the background color
   - Animation
3. How much code for using your library is the same at the application level, regardless of the specific scene?
   - Not much is the same, we tried to abstract most of the technical/repetitive aspects out of the user-facing API.
4. What aspects of your design would you keep, if you got a chance to do this library over?
   - Having the smooth/faceted lightning be a toggle tied to shape.
   - Having the geometry and mesh of the objects in the same structure.
   - Structure of our overall library made it convenient to use and implement.
   - Easy-to-understand names for geometries so there is less of a hurdle for beginners to use Vexed.
5. What aspects of your design would you change?
   - Make the scene itself a group so we don't have to cover similar functionality at both the group and scene level.
   - Change the shape constructor so we decide on lighting first and don't have to type out everything
