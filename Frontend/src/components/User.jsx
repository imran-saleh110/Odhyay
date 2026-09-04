import React from 'react'
import '../styles/User.css'
import { Award, Bookmark, BookOpen, Clock2, Zap } from 'lucide-react'
import Chart from './Chart.jsx'
import ProgressCard from './ProgressCard.jsx'
import { useAuth } from '../context/AuthContext'

const User = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className='user-container'>লোড হচ্ছে...</div>;
  }
  if (!user) {
    return <div className='user-container'>আপনি সাইন ইন করেননি</div>;
  }
  return (
    <div className='user-container'>
      <div className="user-details-card">
        <div className="profile-section">
          <div className="profile-img">
            PS
          </div>
          <div className="name-email-section">
            <h3>{user.displayName}</h3>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="streak-section">
          <div className="heading">
            <p>ধারাবাহিকতা ট্র্যাকার</p>
            <span> <Zap size={15}/> সক্রিয়</span>
          </div>
          <div className="days-meter-section">
            <div className="days-card">
              <p>৫</p>
              <span>দিন</span>
            </div>
            <div className="streak-text-section">
              <h6>ধারাবাহিক স্ট্রিক</h6>
              <p>লক্ষ্য বজায় আছে</p>
            </div>
            <div className="streak-meter">
              <div className="streak-bar-div">
                <div className="streak-bar"></div>
                <p>S</p>
              </div>
              <div className="streak-bar-div">
                <div className="streak-bar"></div>
                <p>M</p>
              </div>
              <div className="streak-bar-div">
                <div className="streak-bar"></div>
                <p>T</p>
              </div>
              <div className="streak-bar-div">
                <div className="streak-bar"></div>
                <p>W</p>
              </div>
              <div className="streak-bar-div">
                <div className="streak-bar"></div>
                <p>T</p>
              </div>
              <div className="streak-bar-div">
                <div className="streak-bar not-filled"></div>
                <p>F</p>
              </div>
              <div className="streak-bar-div">
                <div className="streak-bar not-filled"></div>
                <p>S</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      
      <div className="more-details-card-container">

        <div className="more-details-card">
          <div className="more-det-card-heading">
            <p>মোট ঘণ্টা</p>
            <Clock2 size={16} color='#8a8890'/>
          </div>
          <h3>৩.৫ ঘণ্টা</h3>
          <p>আনুমানিক অধ্যয়ন সময়</p>
        </div>

        <div className="more-details-card">
          <div className="more-det-card-heading">
            <p>সমাধান করা প্রশ্ন</p>
            <BookOpen size={16} color='#8a8890'/>
          </div>
          
          <h3>৩৪</h3>
          <p>অনন্য জমাদান</p>
        </div>

        <div className="more-details-card">
          <div className="more-det-card-heading">
            <p>রিভিশন তালিকা</p>
            <Bookmark size={16} color='#8a8890'/>
          </div>
          
          <h3>৫</h3>
          <p>সংরক্ষিত বুকমার্ক</p>
        </div>

        <div className="more-details-card">
          <div className="more-det-card-heading">
            <p>পরীক্ষার সংখ্যা </p>
            <Award size={16} color='#8a8890'/>
          </div>
          
          <h3>৪</h3>
          <p>সম্পন্ন সেশন</p>
        </div>
      </div>

      <div className="performance-container">
        <div className="graph-card">
          <Chart/>
        </div>
        <div className="progress-card">
          <ProgressCard/>
        </div>
      </div>
    </div>
  )
}

export default User
