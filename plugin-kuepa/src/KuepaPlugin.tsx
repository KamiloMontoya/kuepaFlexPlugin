import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import reducers, { namespace } from './states';

const PLUGIN_NAME = 'KuepaPlugin';

export default class KuepaPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   * @param manager { Flex.Manager }
   */
  init(flex: typeof Flex, manager: Flex.Manager) {
    this.registerReducers(manager);

    const options: Flex.ContentFragmentProps = { sortOrder: -1 };
  
    flex.CRMContainer
    .defaultProps
    .uriCallback = (task) => task
    ? `https://panel.kuepa.com/contactosMX/${task.attributes.contact_id}/edit`
    : 'https://panel.kuepa.com/'


    manager.workerClient.on('reservationCreated', (reservation : any) => {
      if (reservation.task.attributes.autoAnswer === 'true') {
        flex.Actions.invokeAction('AcceptTask', {sid: reservation.sid});
        //select the task
        flex.Actions.invokeAction('SelectTask', {sid: reservation.sid});
      }
    });


  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  private registerReducers(manager: Flex.Manager) {
    if (!manager.store.addReducer) {
      // tslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${Flex.VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
