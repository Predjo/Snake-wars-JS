'use strict';

import ObjectManager      from '../../../shared/scripts/utils/managers/ObjectManager';
import PlayerManager      from '../../../shared/scripts/utils/managers/PlayerManager';
import EventManager       from '../../../shared/scripts/utils/managers/EventManager';
import CollectibleManager from '../../../shared/scripts/utils/managers/CollectibleManager';
import GridManager        from '../../../shared/scripts/utils/managers/GridManager';
import ClientManager      from './ClientManager';

class ServerManager {
  constructor(server, socket) {
    this.server             = server;
    this.socket             = socket;
    this.clientManager      = new ClientManager(socket);
    this.objectManager      = new ObjectManager();
    this.playerManager      = new PlayerManager();
    this.eventManager       = new EventManager();
    this.collectibleManager = new CollectibleManager();
    this.gridManager        = new GridManager();
    this.gridManager.createDefaultBorders();
  }

  listen() {
    this.server.listen(4200, () => {
      let host = this.server.address().address;
      let port = this.server.address().port;

      console.log(`Server at http://${host}:${port}`);

      this.loop();
    });    
  }

  loop() {
    var startTime = (new Date()).getTime();
    this.interval = setInterval(() => {
      let timestamp = (new Date()).getTime() - startTime;
      this.collectibleManager.updateCollectibles(timestamp);
      this.playerManager.updatePlayers(timestamp);
      this.objectManager.detectCollisions();      
      this.clientManager.updateClients();
    }, 15);
  }
}

export default ServerManager;