export const getTeacher = jest.fn((fullName: string) =>
  Promise.resolve({ id: 1, fullName: fullName })
);

export const getNonexistentTeacher = jest.fn(param => Promise.resolve(null));

export const getTeachers = jest.fn(() =>
  Promise.resolve([
    { id: 1, fullName: 'First T.' },
    { id: 2, fullName: 'Second T.' },
  ])
);

export const getEmptyTeachersArray = jest.fn(() => Promise.resolve([]));

export const getTeacherById = jest.fn((id: number) =>
  Promise.resolve({ id: id, fullName: 'Teacher T.T.' })
);
