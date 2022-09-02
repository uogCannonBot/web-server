export default function Dashboard({ user, children }) {
  if (!user) {
    return children;
  }
  return <div>Dashboard</div>;
}
