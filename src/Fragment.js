import merge from 'callbag-merge';

export default function Fragment({ children }) {
  return () => merge(...children);
};