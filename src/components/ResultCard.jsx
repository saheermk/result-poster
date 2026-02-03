import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import ExportButton from './ExportButton';
import { Award, TrendingUp, Calendar, User } from 'lucide-react';

const ResultCard = ({ student, subjects }) => {
  // calculate total and percentage
  const marks = subjects.map(sub => ({
    subject: sub,
    score: parseInt(student[sub] || 0, 10)
  }));
  
  const totalMarks = marks.reduce((acc, curr) => acc + curr.score, 0);
  const maxMarks = marks.length * 100;
  const percentage = maxMarks > 0 ? ((totalMarks / maxMarks) * 100).toFixed(1) : 0;

  // Grade Calculation
  let grade = 'F';
  let gradeColor = 'text-red-500';
  let gradeBg = 'bg-red-50';
  
  if (percentage >= 90) { grade = 'A+'; gradeColor = 'text-emerald-600'; gradeBg = 'bg-emerald-50'; }
  else if (percentage >= 80) { grade = 'A'; gradeColor = 'text-blue-600'; gradeBg = 'bg-blue-50'; }
  else if (percentage >= 70) { grade = 'B'; gradeColor = 'text-purple-600'; gradeBg = 'bg-purple-50'; }
  else if (percentage >= 60) { grade = 'C'; gradeColor = 'text-amber-600'; gradeBg = 'bg-amber-50'; }
  else if (percentage >= 40) { grade = 'D'; gradeColor = 'text-orange-600'; gradeBg = 'bg-orange-50'; }

  // Prepare chart data
  const chartData = marks.map(m => ({
    subject: m.subject.substring(0, 3).toUpperCase(),
    fullSubject: m.subject,
    A: m.score,
    fullMark: 100,
  }));

  const safeStudentName = student.name?.replace(/\s+/g, '_') || 'student';

  return (
    <div className="flex flex-col items-center group">
      {/* 9:16 Aspect Ratio Container - 360x640 */}
      <div 
        id="result-card-node" 
        className="w-[360px] h-[640px] bg-white text-gray-800 shadow-2xl relative overflow-hidden flex flex-col font-sans"
      >
        {/* Dynamic Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-[240px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-b-[60px] scale-110 -translate-y-4"></div>
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>

        {/* Header content */}
        <div className="relative z-10 text-white mt-12 px-6">
          <div className="flex justify-between items-start">
            <div>
               <p className="text-xs font-medium tracking-widest uppercase opacity-80 mb-1">Academic Performance Report</p>
               <h1 className="text-2xl font-black tracking-tight leading-tight mb-2">{student.name}</h1>
            </div>
            <div className={`w-14 h-14 rounded-2xl ${gradeBg} flex items-center justify-center shadow-lg border-2 border-white/20 backdrop-blur-md`}>
                <span className={`text-2xl font-black ${gradeColor}`}>{grade}</span>
            </div>
          </div>
          
          <div className="mt-4 flex gap-3 text-sm font-medium opacity-90">
             <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <User className="w-3.5 h-3.5" />
                <span>Roll: {student.roll_no}</span>
             </div>
             <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                <Calendar className="w-3.5 h-3.5" />
                <span>{student.session || '2023-24'}</span>
             </div>
          </div>
        </div>

        {/* Quick Stats Floating Card */}
        <div className="relative z-20 mx-6 -mt-6">
             <div className="bg-white rounded-2xl shadow-xl p-4 flex justify-between items-center border border-gray-100">
                <div className="text-center flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Marks</p>
                    <p className="text-xl font-black text-gray-800 mt-0.5">{totalMarks} <span className="text-xs text-gray-400 font-medium">/ {maxMarks}</span></p>
                </div>
                <div className="w-px h-8 bg-gray-100"></div>
                <div className="text-center flex-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Average</p>
                    <p className="text-xl font-black text-indigo-600 mt-0.5">{percentage}%</p>
                </div>
             </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col p-6 pt-2 overflow-hidden">
             
             {/* Chart */}
             <div className="flex-1 min-h-0 relative -mx-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="55%" outerRadius="65%" data={chartData}>
                    <PolarGrid stroke="#f3f4f6" />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#9ca3af', fontSize: 9, fontWeight: 'bold' }} 
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Marks"
                        dataKey="A"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fill="#818cf8"
                        fillOpacity={0.5}
                    />
                    </RadarChart>
                </ResponsiveContainer>
             </div>

             {/* Detailed Marks List */}
             <div className="flex-shrink-0 mt-2 space-y-3">
                 <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subject Breakdown</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-2.5">
                     {marks.map((mark, i) => (
                         <div key={i} className="flex items-center gap-3">
                             <div className="w-24 text-xs font-bold text-gray-600 truncate">{mark.subject}</div>
                             <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
                                    style={{ width: `${Math.min(mark.score, 100)}%` }}
                                 ></div>
                             </div>
                             <div className="w-8 text-right text-xs font-bold text-gray-700">{mark.score}</div>
                         </div>
                     ))}
                 </div>
             </div>
        </div>

        {/* Footer */}
        <div className="w-full bg-slate-50 border-t border-slate-100 py-3 px-6 flex justify-between items-center">
             <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Official Report</span>
             </div>
             <p className="text-[9px] text-gray-300 font-mono">ID: {student.student_id || 'UNKNOWN'}</p>
        </div>
      </div>

      <div className="w-[360px] mt-4">
        <ExportButton targetId="result-card-node" fileName={`Results_${safeStudentName}`} />
      </div>
    </div>
  );
};

export default ResultCard;
