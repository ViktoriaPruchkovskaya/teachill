import { MongoConnection } from '../mongo/connection';
import { performance } from 'perf_hooks';
import { Int32 } from 'mongodb';

export function syncLogger(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function(groupId: number): Promise<void> {
    let isUpdateSucceed = true;
    const updateTime = new Date();
    const updateStartTime = performance.now();

    try {
      await originalMethod.call(this, groupId);
    } catch (err) {
      console.error(err);
      isUpdateSucceed = false;
    }

    const updateEndTime = performance.now();

    await MongoConnection.getDb()
      .collection('syncLog')
      .insertOne({
        group_id: groupId,
        update_time: updateTime,
        duration: new Int32(updateEndTime - updateStartTime),
        is_update_succeed: isUpdateSucceed,
      });
  };

  return descriptor;
}
