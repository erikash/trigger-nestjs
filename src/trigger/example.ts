import { logger, task, wait } from '@trigger.dev/sdk/v3';

export const synchronizeAllEmployees = task({
  id: 'synchoronize-all-employees',
  run: async (payload: any, { ctx }) => {
    logger.log('starting synchoronize-all-employees', { payload, ctx });

    // iterate 2000 times and call synchronize-employee task with the index as the payload
    const employees = Array.from({ length: 200 }, (_, i) => i);

    const batchSize = 100;
    const batchedEmployees = Array.from(
      { length: Math.ceil(employees.length / batchSize) },
      (_, i) => employees.slice(i * batchSize, i * batchSize + batchSize),
    );

    const promises = batchedEmployees.map(async (batch) => {
      return await synchronizeEmployeeTask.batchTrigger({
        items: batch.map((employeeId) => ({ payload: { employeeId } })),
      });
    });

    const batchHandles = await Promise.all(promises);

    return Response.json(batchHandles);
  },
});

export const synchronizeEmployeeTask = task({
  queue: {
    concurrencyLimit: 5,
  },
  id: 'synchronize-employee',
  run: async (payload: any, { ctx }) => {
    logger.log('starting synchronize-employee', { payload, ctx });

    await wait.for({ seconds: 0.2 });

    return Response.json({ success: true });
  },
});
