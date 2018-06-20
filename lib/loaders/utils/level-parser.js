import { Level } from '../../ecs';
import ecsUtils from './ecs-utils';
import resl from "../../misc/resl";

export default function (app, json, callback) {
  ecsUtils.preloadAssets(app, json, () => {
    let entInfos = json.entities;
    let entities = new Array(json.entities.length);
    // add them to level
    let level = new Level();

    // create entities and prefabs
    for (let i = 0; i < entInfos.length; ++i) {
      let entInfo = entInfos[i];
      if (entInfo.prefab) {
        let prefab = app.assets.get(entInfo.prefab);
        if (!prefab) {
          console.error(`Failed to load prefab ${entInfo.prefab}`);
          continue;
        }

        entities[i] = prefab.instantiate(entInfo.modifications, level);
      } else {
        entities[i] = ecsUtils.createEntity(app, entInfo, level);
      }

      console.log(`${entInfo.name} loaded`);
    }

    // finalize entities
    ecsUtils.finalize(app, entities, json.entities);

    for (let i = 0; i < json.children.length; ++i) {
      let idx = json.children[i];
      level.append(entities[idx]);
    }

    let skyboxes = json.skyboxes;
    for (let i = 0; i < skyboxes.length; ++i) {
      let skyboxInfo = skyboxes[i];
      app.assets.load(skyboxInfo.texture, (err, skyboxTexture) => {
        let skyboxEntity = app.find(skyboxInfo.camera);
        let cameraComponent;
        if (skyboxEntity != null)
          cameraComponent = skyboxEntity.getComp('Camera');
        else
          skyboxEntity = app.createEntity("Cocos default skybox", level);
        let skyboxComponent = skyboxEntity.addComp("Skybox");
        skyboxComponent.cubeMap = skyboxTexture;
        if (cameraComponent != null)
          skyboxComponent._model._cameraID = cameraComponent._camera._cameraID;
      });
    }

    if (callback) {
      callback(null, level);
    }
  });
}