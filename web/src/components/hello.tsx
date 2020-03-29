import * as React from 'react';
import { useState, useEffect } from 'react';

export interface HelloProps {
  compiler: string;
  framework: string;
}

interface Group {
  id: number;
  name: string;
}

export const Hello = (props: HelloProps) => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    (async function() {
      const result = await fetch('/api/groups', {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFudG9ua292YWx5b3YiLCJpYXQiOjE1ODQwMzA0MTJ9.QSqxR5D-ajhL8VmD7gX70JxZSFpSyeEgUnPFVnp2xZ0',
        },
      });
      const groups = await result.json();
      setGroups(groups);
    })();
  }, []);

  return (
    <div>
      <h1>
        Hello from {props.compiler} and {props.framework}!
      </h1>
      <p>Here is your groups: {groups.map(group => `${group.name} `)}</p>
    </div>
  );
};
