(() => {
  const app = window.app;
  const cc = window.cc;
  const { color4, quat } = cc.math;
  let screen = app.createEntity('screen');
  screen.addComp('Screen');
  let spriteCmps = [];
  let screenX = 500;
  let minX = 0;
  let screenY = 800;
  let minY = 0;
  let gravity = 0.5;
  let isAdding = false;
  let bunnys_no = [];
  bunnys_no[0] = 'bunnys_0';
  bunnys_no[1] = 'bunnys_1';
  bunnys_no[2] = 'bunnys_2';
  bunnys_no[3] = 'bunnys_3';
  bunnys_no[4] = 'bunnys_4';
  let count = 0;

  // var number;
  // number: cc.Label;

  for (let i = 0; i < 2; ++i) {
    let entity = app.createEntity(`sprite${i}`);
    entity.setParent(screen);
    let widget = entity.addComp('Widget');
    widget.width = Math.random() * 15 + 15;
    widget.height = widget.width * 1.25;
    widget.setAnchors(0, 0, 0, 0);
    widget._offsetX = Math.random() * screenX;
    widget._offsetY = Math.random() * screenY;
    widget.speedX = Math.random() * 10;
    widget.speedY = (Math.random() * 10) - 5;;

    app.assets.loadUrls('texture', {
      json: './assets/sprites/bunny.json',
      image: './assets/sprites/bunny.png'
    }, (err, texture) => {
      let spriteCmp = entity.addComp('Sprite');
      spriteCmp.sprite = texture._sprites[bunnys_no[0]];
      spriteCmps.push(widget);
      console.log(spriteCmps[i]);
    });
  }

  // let entity_label = app.createEntity(`label_big`);
  // entity_label.setParent(screen);
  // let widget = entity_label.addComp('Widget');
  // widget.width = 60;
  // widget.height = 60;
  // widget.setAnchors(0, 0, 0, 0);
  // widget._offsetX = screenX/2-30;
  // widget._offsetY = screenY/2-30;

  // let labelCmp = entity_label.addComp('Label');
  // labelCmp.label = '2';
  // labelCmp.color = color4.new(1.0, 1.0, 1.0, 1.0);
  // labelCmp.horizontalAlign = cc.TEXT_ALIGN_CENTER;
  // labelCmp.verticalAlign = cc.TEXT_ALIGN_CENTER;
  // window._testlabel = labelCmp;

  app.on('tick', () => {

    if (app._input.mousedown('left')) {
      count++;
    }
    if (app._input.mousepress('left')) {
      for (let i = 0; i < 5; i++) {
        let entity = app.createEntity(`sprite${i}`);
        quat.fromEuler(entity.lrot, 0, 0, Math.random() * 90 - 45);
        entity.setParent(screen);

        let widget = entity.addComp('Widget');
        widget.width = Math.random() * 15 + 15;
        widget.height = widget.width;
        widget.setAnchors(0, 0, 0, 0);
        widget._offsetX = minX + 10;;
        widget._offsetY = screenY * 0.7;
        widget.speedX = Math.random() * 10;
        widget.speedY = (Math.random() * 10) - 5;;

        app.assets.loadUrls('texture', {
          json: './assets/sprites/bunny.json',
          image: './assets/sprites/bunny.png'
        }, (err, texture) => {
          let spriteCmp = entity.addComp('Sprite');
          spriteCmp.sprite = texture._sprites[bunnys_no[count % 5]];
          spriteCmps.push(widget);
          spriteCmp.scale = 0.5 + Math.random() * 0.5;
          spriteCmp.rotation = 360 * (Math.random() * 0.2 - 0.1);
        });
      }
    }

    let start = new Date().getTime();

    for (let i = 0; i < spriteCmps.length; i++) {
      let widget = spriteCmps[i];

      widget._offsetX = widget._offsetX + widget.speedX;
      widget._offsetY = widget._offsetY - widget.speedY;
      widget.speedY += gravity;

      if (widget._offsetX > screenX) {
        widget.speedX *= -1;
        widget._offsetX = screenX;
      }
      else if (widget._offsetX < minX) {
        widget.speedX *= -1;
        widget._offsetX = minX;
      }

      if (widget._offsetY < 0) {
        widget.speedY *= -0.85;
        widget._offsetY = minY;
        if (Math.random() > 0.5) {
          widget.speedY -= Math.random() * 6;
        }
      }
      else if (widget._offsetY > screenY) {
        widget.speedY *= -1;
        widget._offsetY = screenY;
      }
    }

    let end = new Date().getTime();
    // console.log('Update / Delta Time =', end-start, '/', dt*1000, '=', ((end-start)/(dt*1000)).toFixed(2));
  });



})();