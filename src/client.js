import * as sapper from '@sapper/app';

import { initClient } from './i18n/i18n.js';

initClient();

sapper.start({
	target: document.querySelector('#sapper')
});