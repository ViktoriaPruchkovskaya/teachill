import { MongoConnection } from '../mongo/connection';
import { SyncBSUIR } from './bsuir/sync';
import { performance } from 'perf_hooks';

export function syncLogger() {
  return function(
    target: SyncBSUIR,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function(groupId: number): Promise<void> {
      const collection = MongoConnection.getDb().collection('syncLog');

      let isUpdateSucceed = true;
      const updateTime = Date.now();
      const updateStartTime = performance.now();

      const newMethod = originalMethod.call(this, groupId);
      try {
        await newMethod;
      } catch (err) {
        console.error(err);
        isUpdateSucceed = false;
      }

      const updateEndTime = performance.now();

      await collection.insertOne({
        group_id: groupId,
        update_time: updateTime,
        duration: updateEndTime - updateStartTime,
        is_update_succeed: isUpdateSucceed,
      });
    };

    return descriptor;
  };
}
