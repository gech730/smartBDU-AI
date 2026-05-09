import { useState, useEffect } from 'react';
import { Coffee, Home, Bus, MapPin, Phone, Clock, Wifi, Utensils, Moon, Sun } from 'lucide-react';
import { campusAPI } from '../services/smartBDUAPI';

export default function CampusServices() {
  const [activeTab, setActiveTab] = useState('cafeteria');
  const [cafeterias, setCafeterias] = useState([]);
  const [dormitories, setDormitories] = useState([]);
  const [transport, setTransport] = useState([]);
  const [todayMenu, setTodayMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cafeteriaRes, dormRes, transportRes, menuRes] = await Promise.all([
        campusAPI.getCafeterias(),
        campusAPI.getDormitories(),
        campusAPI.getTransport(),
        campusAPI.getTodayMenu()
      ]);
      setCafeterias(cafeteriaRes.cafeterias || []);
      setDormitories(dormRes.dormitories || []);
      setTransport(transportRes.transports || []);
      setTodayMenu(menuRes);
    } catch (error) {
      console.error('Error loading campus data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campus Services</h1>
        <p className="text-gray-400 mt-1">Everything you need to know about campus life</p>
      </div>

      <div className="flex gap-4 border-b border-dark pb-4">
        <button
          onClick={() => setActiveTab('cafeteria')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === 'cafeteria' ? 'bg-primary text-white' : 'bg-dark-lighter'
          }`}
        >
          <Coffee className="w-5 h-5" />
          Cafeteria
        </button>
        <button
          onClick={() => setActiveTab('dormitory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === 'dormitory' ? 'bg-primary text-white' : 'bg-dark-lighter'
          }`}
        >
          <Home className="w-5 h-5" />
          Dormitories
        </button>
        <button
          onClick={() => setActiveTab('transport')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === 'transport' ? 'bg-primary text-white' : 'bg-dark-lighter'
          }`}
        >
          <Bus className="w-5 h-5" />
          Transport
        </button>
      </div>

      {activeTab === 'cafeteria' && <CafeteriaSection menus={todayMenu} cafeterias={cafeterias} />}
      {activeTab === 'dormitory' && <DormitorySection dormitories={dormitories} />}
      {activeTab === 'transport' && <TransportSection transport={transport} />}
    </div>
  );
}

function CafeteriaSection({ menus, cafeterias }) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Utensils className="w-6 h-6" />
          <span className="text-lg font-semibold">Today's Menu</span>
        </div>
        <p className="text-2xl font-bold">{today}</p>
      </div>

      {menus?.menus?.map((cafeteria, idx) => (
        <div key={idx} className="bg-dark-lighter rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">{cafeteria.cafeteria}</h3>
          <p className="text-gray-400 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {cafeteria.location}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['breakfast', 'lunch', 'dinner'].map(meal => (
              <div key={meal} className="bg-dark rounded-lg p-4">
                <h4 className="font-semibold mb-3 capitalize flex items-center gap-2">
                  {meal === 'breakfast' ? <Sun className="w-4 h-4 text-yellow-400" /> :
                   meal === 'lunch' ? <Utensils className="w-4 h-4 text-orange-400" /> :
                   <Moon className="w-4 h-4 text-blue-400" />}
                  {meal}
                </h4>
                {cafeteria.menu[meal]?.length > 0 ? (
                  <ul className="space-y-2">
                    {cafeteria.menu[meal].map((item, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="text-primary">{item.price} ETB</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">Not available</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DormitorySection({ dormitories }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {dormitories.map((dorm, idx) => (
        <div key={idx} className="bg-dark-lighter rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{dorm.name}</h3>
                <p className="text-gray-400 flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4" />
                  {dorm.location}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                dorm.type === 'male' ? 'bg-blue-500/20 text-blue-400' :
                dorm.type === 'female' ? 'bg-pink-500/20 text-pink-400' :
                'bg-purple-500/20 text-purple-400'
              }`}>
                {dorm.type}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-dark rounded-lg p-3">
                <p className="text-gray-400 text-sm">Capacity</p>
                <p className="font-semibold">{dorm.capacity}</p>
              </div>
              <div className="bg-dark rounded-lg p-3">
                <p className="text-gray-400 text-sm">Occupied</p>
                <p className="font-semibold">{dorm.occupied}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {dorm.facilities?.wifi && <AmenityBadge icon={<Wifi className="w-3 h-3" />} label="WiFi" />}
                {dorm.facilities?.laundry && <AmenityBadge icon={<Utensils className="w-3 h-3" />} label="Laundry" />}
                {dorm.facilities?.cafeteria && <AmenityBadge icon={<Coffee className="w-3 h-3" />} label="Cafeteria" />}
                {dorm.facilities?.studyRoom && <AmenityBadge icon={<Moon className="w-3 h-3" />} label="Study Room" />}
              </div>
            </div>

            {dorm.contactPhone && (
              <div className="mt-4 pt-4 border-t border-dark flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{dorm.contactPhone}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function AmenityBadge({ icon, label }) {
  return (
    <span className="flex items-center gap-1 px-2 py-1 bg-dark rounded-full text-xs">
      {icon}
      {label}
    </span>
  );
}

function TransportSection({ transport }) {
  return (
    <div className="space-y-4">
      {transport.map((t, idx) => (
        <div key={idx} className="bg-dark-lighter rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">{t.name}</h3>
              <p className="text-gray-400">{t.type}</p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
              {t.fare?.amount} ETB
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 text-center">
              <p className="text-gray-400 text-sm">From</p>
              <p className="font-medium">{t.route?.from}</p>
            </div>
            <div className="text-2xl">→</div>
            <div className="flex-1 text-center">
              <p className="text-gray-400 text-sm">To</p>
              <p className="font-medium">{t.route?.to}</p>
            </div>
          </div>

          {t.route?.stops?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Stops</h4>
              <div className="flex flex-wrap gap-2">
                {t.route.stops.map((stop, i) => (
                  <span key={i} className="px-3 py-1 bg-dark rounded-full text-sm">
                    {stop.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {t.schedule?.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Schedule</h4>
              <div className="space-y-2">
                {t.schedule.slice(0, 2).map((sch, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-400">{sch.day}</span>
                    <span>{sch.departureTimes?.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
