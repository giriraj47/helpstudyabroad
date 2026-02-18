import UsersClient from '@/components/UsersClient';

export default async function UsersPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const limit = Number(params?.limit) || 10; // Default to 12 for grid layout (2,3,4,6 divisibility)
  const skip = (page - 1) * limit;

  // Fetch users data on the server with caching
  const response = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`, {
    next: { revalidate: 300 } // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();

  // Transform the API data
  const initialUsers = data.users.map(user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    age: user.age,
    gender: user.gender,
    address: user.address,
    company: user.company,
    role: user.role,
    country: user.address?.country || 'Unknown',
    program: user.company?.department || 'General',
    status: user.id % 3 === 0 ? 'Pending' : 'Active'
  }));

  return (
    <UsersClient 
      initialUsers={initialUsers} 
      total={data.total}
      page={page}
      limit={limit}
    />
  );
}
