

## Hexed Vortex Graphic

##### https://github.com/lmu-cmsi3710-spring2023/our-own-3d-library-hexed-vortex-graphic

| Category | Feedback | Points |
| --- | --- | ---: |
| | **4×4 matrix object/library** | |
| • Identity | New matrix defaults to the identity matrix | 2/2 |
| • Multiplication | Matrix multiplication is implemented  | 8/8 |
| • Group matrix | All matrices are implemented | 4/4 |
| • GLSL conversion | Conversion to column-major 1D `Float32Array` is not implemented, however, you do include a `transpose` method, which converts your 16 element 1D array into a column major 16 element 1D array. Please note that it would be better if you created helper functions within the matrix class for common matrix applications. Because you end up calling `new Float32Array()` on an instance of the matrix every single time, it would be prudent to simply return a new instance of a `Float32Array` rather than a simple 1D 16 element array (–1) | 2/3 |
| • Implementation | The matrix library is implemented well. | 5/5 |
| | **Matrix test suite** | |
| • Identity test |  Identity matrix default is explicitly tested | 1/1 |
| • Identity coverage | Identity matrix default is fully covered by tests | 1/1 |
| • Multiplication test | Matrix multiplication is explicitly tested | 4/4 |
| • Multiplication coverage | Matrix multiplication is fully covered by tests | 4/4 |
| • Group matrix test | All matrices are explicitly tested | 2/2 |
| • Group matrix coverage | All matrices are covered | 2/2 |
| • GLSL conversion test | As you did in fact test your `transpose` method, no points shall be deducted here. | 2/2 |
| • GLSL conversion coverage | `transpose` method was aptly covered | 1/1 |
| • _matrix-credits.md_ | _matrix-credits.md_ clearly lists who did what |  |
| | **Matrix use in 3D objects** | |
| • Instance transformation | An instance transform is maintained and used | 10/10 |
| • Parent propagation | Groups propagate their transforms properly. | 15/15 |
| • Implementation | Matrix used by 3D objects is implemented well | 5/5 |
| | **Matrix use in projection** | |
| • Correct usage | You implemented your projection matrix directly in the `Scene` class and used default values. While this is fine for now, you should remember that you should give the user a way to change from perspective to orthogonal, and the option to select which specific values to use. Remember projection is typically used to break out of the 2 by 2 square scene, so it should be customizable from the users perspective.  | 10/10 |
| • Implementation | Projection matrices are implemented well. | 5/5 |
| Extra credit (if any) | n/a |  |
| Code maintainability | No maintainability issues found that were not referenced in Static Scene assignment. |  |
| Code readability | Code is readable. No major readability issues. |  |
| Version control | Decent commit count with sufficiently descriptive messages |  |
| Punctuality | Last commit of tag: 03/29/23 10:51 PM<br /><br /> **Graded commit:** https://github.com/lmu-cmsi3710-spring2023/our-own-3d-library-hexed-vortex-graphic/commit/35e29f1e98190f06102147bc16abf55b832daeac |  |
| | **Total** | **83/84** |
