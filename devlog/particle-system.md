# Particle System
我们的粒子系统是模仿 Unity(5.6.3p1) 的 Shuriken Particle System 来实现的。

## 当前实现进度：
Main Module:
  DONE:
    Duration, Looping, Prewarm, Start Delay, Start Lifetime, Start Speed,
    Start Size, Start Rotation, Start Color, Gravity Modifier,
    Simulation Space(Local, World), Simulation Speed, Play On Awake,
    Max Particles.
  TODO:
    3D Start Size, 3D Start Rotation, Randomize Rotation, Scaling Mode, Auto Random Seed,
    Simulation Space(Custom).

Emission Module:
  DONE:
    Rate over Time, Rate over Distance, Bursts.

Shape Module:
  Sphere:
    DONE:
      Radius, Emit from Shell.
    TODO:
      Align To Direction, Randomize Direction, Spherize Direction.
  Hemisphere:
    DONE:
      Radius, Emit from Shell.
    TODO:
      Align To Direction, Randomize Direction, Spherize Direction.
  Box:
    DONE:
      Box X, Box Y, Box Z, Emit From.
    TODO:
      Align To Direction, Randomize Direction, Spherize Direction.
  Circle:
    DONE:
      Radius, Arc, Emit from Edge.
    TODO:
      Mode, Spread, Align To Direction, Randomize Direction, Spherize Direction.
  Edge:
    DONE:
      Radius.
    TODO:
      Mode, Spread, Align To Direction, Randomize Direction, Spherize Direction.
  TODO Shapes:
    Cone, Mesh, Mesh Renderer, Skinned Mesh Renderer.

Color over Lifetime Module:
  TODO: fixed mode

Renderer Module:
  DONE:
    Render Mode(Billboard, Stretched Billboard, Verticle Billboard, Horizontal Billboard),
    Material, Custom Vertex Streams.
  TODO:
    Others.

未列出的 Modules 还没有实现，部分功能需要依赖 timeline, curve 等功能点的实现。
