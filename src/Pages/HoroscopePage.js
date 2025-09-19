// src/components/HoroscopePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HoroscopePage = ({ sign = 'leo' }) => {
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHoroscope = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://194.164.148.244:4061/api/users/horoscope?sign=${sign}`
        );
        setHoroscope(res.data);
      } catch (err) {
        setError('Failed to fetch horoscope');
      } finally {
        setLoading(false);
      }
    };
    fetchHoroscope();
  }, [sign]);

  const zodiacDetails = {
    leo: {
      name: 'Leo',
      dateRange: 'Jul 23 - Aug 22',
      element: 'Fire Element',
      about: 'Bold, intelligent, warm, and courageous, Leo is a natural leader.',
      icon: '♌️', // you can replace with an SVG or image
    },
    // add other zodiac details if you want
  };

  const details = zodiacDetails[sign] || {};

  return (
    <div className="bg-[#0f1120] min-h-screen text-white p-4">
      <h1 className="text-xl font-bold mb-2 flex items-center">
        <span className="bg-orange-500 text-white p-2 rounded-xl mr-2">✦</span>
        Daily Horoscope
      </h1>
      <p className="text-gray-300 mb-6">
        Discover what the stars have in store
      </p>

      {/* Zodiac Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'].map(z=>(
          <button
            key={z}
            onClick={()=>window.location.reload()} // handle sign change in parent ideally
            className={`p-3 rounded-xl ${z===sign?'bg-orange-500':'bg-gray-800'}`}
          >
            {z.charAt(0).toUpperCase()+z.slice(1)}
          </button>
        ))}
      </div>

      {/* Selected Sign */}
      <div className="bg-gray-800 rounded-2xl p-4 mb-6">
        <div className="flex items-center mb-2">
          <span className="text-4xl mr-3">{details.icon}</span>
          <div>
            <h2 className="text-2xl font-bold">{details.name}</h2>
            <p className="text-sm text-gray-400">{details.dateRange}</p>
          </div>
        </div>
        <span className="bg-orange-500 text-xs rounded-full px-3 py-1">
          {details.element}
        </span>

        <div className="mt-4">
          <h3 className="font-semibold mb-1">About {details.name}</h3>
          <p className="text-gray-300 text-sm">{details.about}</p>
        </div>
      </div>

      {/* Today's Horoscope */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <h3 className="font-semibold mb-2">Today's Horoscope</h3>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {horoscope && (
          <div>
            <p className="text-xs text-gray-400 mb-2">{horoscope.date}</p>
            <p className="text-sm">{horoscope.horoscope}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoroscopePage;
