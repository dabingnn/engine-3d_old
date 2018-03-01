# 测试内容

在 pc (chrome, safari, firefox) 和手机浏览器中 (chrome, safari, 微信，qq) 运行测试

## u3d-exporter

### spec-zed

  - 导出场景并在 engine-3d 中加载运行
  - 检查导出模型在无动画状态下是否正常显示
  - 随机抽样动画并播放，看动画播放结果是否正常

### spec-comp-disabled

  - 导出场景并在 engine-3d 中加载运行
  - 检查 wall-disabled 中 Model Comopnent 是否为 disabled 状态

### spec-entity-disabled

  - 导出场景并在 engine-3d 中加载运行
  - 检查 wall-disabled 的 Entity 是否为 disabled 状态

### spec-prefab-disabled

  - 导出场景并在 engine-3d 中加载运行
  - 检查 block_2x2x2 这个 prefab 实例化后的 entity 是否为 disabled 状态

### spec-blood-and-fire

  - 导出场景并在 engine-3d 中加载运行
  - 检查渲染是否正确

### spec-mesh-asset

  - 导出场景并在 engine-3d 中加载运行
  - 检查渲染是否正确

### spec-primitives

  - 导出场景并在 engine-3d 中加载运行
  - 检查对应的 primitives 是否生成（注：贴图 uv 不一致这个是已知问题可忽略）

### spec-multiple-children

  - 导出场景并在 engine-3d 中加载运行
  - prefab-with-children 的所有节点是否正确生成

### spec-use-default-transform

  - 导出场景并在 engine-3d 中加载运行
  - 检查 prefab-with-custom-transform 的 transform 数据是否正确
  - 检查 prefab-mod 中修改的数据是否被读入

### spec-use-new-name

  - 导出场景并在 engine-3d 中加载运行
  - 检查 prefab-foo, prefab-bar 和 prefab-complex (包括他的 children) 的 entity 名字是否正确

### spec-script-simple

  - 导出场景 ~~并在 engine-3d 中加载运行~~
  - 检查导出数据中是否包含 ScriptComponent 对应的 Component 和数据

### spec-bitmap-font

  - 导出场景并在 engine-3d 中加载运行
  - 检查渲染是否正确

### spec-button

  - 导出场景并在 engine-3d 中加载运行
  - 检查渲染是否正确

### spec-mask-nested

  - 导出场景并在 engine-3d 中加载运行
  - 检查渲染是否正确

### spec-mask-same-level

  - 导出场景并在 engine-3d 中加载运行
  - 检查渲染是否正确

### spec-opentype-font

  - 导出场景并在 engine-3d 中加载运行
  - 检查渲染是否正确

### spec-simple

  - 导出场景并在 engine-3d 中加载运行
  - 检查渲染是否正确

### spec-system-font

  - 导出场景并在 engine-3d 中加载运行
  - 检查渲染是否正确

## engine-3d

### 渲染检查

  - PBR
  - Font
  - Sliced Sprite
  - Shadow Map

### 性能检查

  - Bunny (对比 Bunny 在两个版本之间帧数与个数的关系)