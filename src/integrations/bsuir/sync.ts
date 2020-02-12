import { BSUIRClient } from './client';
import { BSUIRResponseMapper } from './mapper';

const client = new BSUIRClient();
const mapper = new BSUIRResponseMapper();
client
  .getGroupSchedule(610901)
  .then(groupSchedule => mapper.getSchedule(groupSchedule))
  .catch(err => console.error(err));
