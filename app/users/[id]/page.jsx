import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function UserDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  let user = null;
  let error = null;

  try {
    const response = await fetch(`https://dummyjson.com/users/${id}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error('Failed to fetch user details');
    }
    
    user = await response.json();
  } catch (err) {
    error = err.message;
    // Don't log 404s as errors
    if (err.message !== 'NEXT_NOT_FOUND') {
      console.error('Error fetching user:', err);
    }
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-xl border border-red-200 max-w-md">
          <svg className="w-16 h-16 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading User</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Link 
            href="/users"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  // Not Found will be handled by Next.js notFound(), but just in case
  if (!user) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Top Banner Background */}
      <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 w-full absolute top-0 left-0 z-0"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
        {/* Back Button */}
        <Link 
          href="/users"
          className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors duration-200 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Users
        </Link>

        {/* Header Profile Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-32 h-32 rounded-xl bg-gray-50 shadow-inner flex items-center justify-center shrink-0 border-4 border-white -mt-16 md:-mt-0">
             <span className="text-4xl font-bold text-blue-600">
               {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
             </span>
          </div>
          
          <div className="flex-1 text-center md:text-left pb-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600">
              <span className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {user.company?.title || 'User'}
              </span>
              <span className="flex items-center text-sm">
                 <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {user.email}
              </span>
              <span className="flex items-center text-sm">
                 <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {user.address?.city}, {user.address?.stateCode}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Personal Details) */}
          <div className="space-y-6">
             {/* Personal Info Card */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Personal Details
                </h3>
                <div className="space-y-4">
                  <InfoItem label="Age" value={`${user.age} years`} />
                  <InfoItem label="Gender" value={user.gender} className="capitalize" />
                  <InfoItem label="Birth Date" value={user.birthDate} />
                  <InfoItem label="Blood Group" value={user.bloodGroup} />
                </div>
            </div>

             {/* Connection Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  System Info
                </h3>
                <div className="space-y-4">
                  <InfoItem label="Username" value={`@${user.username}`} />
                  <InfoItem label="IP Address" value={user.ip} />
                  <InfoItem label="Mac Address" value={user.macAddress} />
                </div>
            </div>
          </div>

          {/* Right Column (Wide Details) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Professional & Contact */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                      Employment
                    </h3>
                    <div className="space-y-4">
                       <InfoItem label="Company" value={user.company?.name} />
                       <InfoItem label="Title" value={user.company?.title} />
                       <InfoItem label="Department" value={user.company?.department} />
                       <InfoItem label="Address" value={`${user.company?.address?.address}, ${user.company?.address?.city}`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                       Contact
                    </h3>
                    <div className="space-y-4">
                       <InfoItem label="Phone" value={user.phone} />
                       <InfoItem label="Email" value={user.email} />
                       <InfoItem label="Full Address" value={`${user.address?.address}, ${user.address?.city}, ${user.address?.state} ${user.address?.postalCode}`} />
                    </div>
                  </div>
               </div>
            </div>

            {/* University */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Education
               </h3>
                <div className="flex items-center p-4 bg-blue-50 rounded-lg text-blue-900">
                    <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{user.university}</p>
                      <p className="text-sm opacity-70">Primary Institution</p>
                    </div>
                </div>
            </div>

            {/* Financials (If available) */}
             {(user.bank || user.crypto) && (
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Financial Details
                  </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.bank && (
                        <div>
                           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Banking</p>
                           <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                              <p className="font-bold text-gray-900">{user.bank.cardType}</p>
                              <p className="font-mono text-gray-600 mt-1">**** {user.bank.cardNumber.slice(-4)}</p>
                              <p className="text-xs text-gray-400 mt-2">Expires {user.bank.cardExpire}</p>
                           </div>
                        </div>
                      )}
                      {user.crypto && (
                         <div>
                           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Crypto Wallet</p>
                            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-gray-900">{user.crypto.coin}</span>
                                <span className="text-[10px] bg-gray-200 px-2 py-0.5 rounded-full text-gray-600 font-medium">{user.crypto.network}</span>
                              </div>
                              <p className="font-mono text-xs text-gray-500 break-all">{user.crypto.wallet}</p>
                           </div>
                        </div>
                      )}
                   </div>
               </div>
             )}

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for displaying information
function InfoItem({ label, value, className = '' }) {
  if (!value) return null;
  
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 mb-1 font-medium">{label}</span>
      <span className={`text-base text-gray-900 font-medium break-words ${className}`}>{value}</span>
    </div>
  );
}
