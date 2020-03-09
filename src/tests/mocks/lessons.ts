export const getGroupLessonById = jest.fn((groupId: number, lessonId: number) =>
  Promise.resolve(lessonId)
);

export const getNonexistentGroupLessonById = jest.fn((groupId: number, lessonId: number) =>
  Promise.resolve(null)
);
