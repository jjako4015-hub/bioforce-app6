import React, { useState } from 'react';
import { PROFILES_CONFIG } from './data/profileRanks';
import { ProfileCategory, SectionType, Question } from './types';
import { textbookTopics, week1Topics, week2Topics, getUniqueQuestionPool } from './data/questionDatabase';
import { CharacterCanvas } from './components/3d/CharacterCanvas';
import { BiologyModel } from './components/3d/BiologyModel';
import { GreenStar3D } from './components/3d/GreenStar3D';
import { globalAntiDuplicate } from './utils/testValidator';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  // Navigation & Profile State
  const [selectedProfile, setSelectedProfile] = useState<ProfileCategory | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<SectionType>('modules');
  
  // Progress State
  const [userXp, setUserXp] = useState<number>(0);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [completedWeek1Final, setCompletedWeek1Final] = useState<boolean>(false);
  const [completedWeek2Final, setCompletedWeek2Final] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<{ question: Question; userAnswer: string }[]>([]);
  
  // Active Test State
  const [activeTest, setActiveTest] = useState<{
    type: 'topic' | 'week1_final' | 'week2_final' | 'monthly';
    topicId?: string;
    questions: Question[];
    currentIndex: number;
    score: number;
  } | null>(null);

  const [motivationMsg, setMotivationMsg] = useState<string | null>(null);

  // Profile Rank Progress
  const currentProfileData = selectedProfile ? PROFILES_CONFIG[selectedProfile] : null;
  const currentRank = currentProfileData?.ranks.slice().reverse().find(r => userXp >= r.requiredXp) || currentProfileData?.ranks[0];

  // System Progress Calculations
  const generalProgressPercent = Math.round((completedTopics.length / textbookTopics.length) * 100);
  const week1ProgressPercent = Math.round((week1Topics.filter(t => completedTopics.includes(t.id)).length / 4) * 100);
  
  // RULE 10: Week 2 unlock requirements
  const week2Unlocked = completedTopics.includes('topic_1') && completedTopics.includes('topic_2') && 
                         completedTopics.includes('topic_3') && completedTopics.includes('topic_4') && 
                         completedWeek1Final;
  const week2ProgressPercent = week2Unlocked ? Math.round((week2Topics.filter(t => completedTopics.includes(t.id)).length / week2Topics.length) * 100) : 0;

  // --------------------------------------------------------------------------
  // TEST GENERATION PIPELINE (STRICT COUNT & STRICT UNIQUENESS RULES)
  // --------------------------------------------------------------------------
  const startTopicTest = (topicId: string) => {
    // RULE 3: Exactly 20 unique questions per topic
    const questions = getUniqueQuestionPool('topic_test', topicId, 20, Number(topicId.replace('topic_', '')) <= 4 ? 1 : 2);
    questions.forEach(q => globalAntiDuplicate.registerQuestion(q));

    setActiveTest({ type: 'topic', topicId, questions, currentIndex: 0, score: 0 });
  };

  const startWeek1Final = () => {
    // RULE 8 & 9: 50 NEW UNIQUE QUESTIONS
    const questions: Question[] = [];
    week1Topics.forEach(t => {
      const qPool = getUniqueQuestionPool('w1_final', t.id, 13, 1);
      questions.push(...qPool);
    });
    const final50 = questions.slice(0, 50);
    final50.forEach(q => globalAntiDuplicate.registerQuestion(q));

    setActiveTest({ type: 'week1_final', questions: final50, currentIndex: 0, score: 0 });
  };

  const startWeek2Final = () => {
    // RULE 11 & 12: 50 NEW UNIQUE QUESTIONS
    const questions: Question[] = [];
    week2Topics.forEach(t => {
      const qPool = getUniqueQuestionPool('w2_final', t.id, 10, 2);
      questions.push(...qPool);
    });
    const final50 = questions.slice(0, 50);
    final50.forEach(q => globalAntiDuplicate.registerQuestion(q));

    setActiveTest({ type: 'week2_final', questions: final50, currentIndex: 0, score: 0 });
  };

  const startMonthlyTest = () => {
    // RULE 15 & 16: EXACTLY 100 COMPLETELY NEW UNIQUE QUESTIONS
    const questions: Question[] = [];
    textbookTopics.forEach(t => {
      const qPool = getUniqueQuestionPool('monthly_test', t.id, 12, 1);
      questions.push(...qPool);
    });
    const final100 = questions.slice(0, 100);
    final100.forEach(q => globalAntiDuplicate.registerQuestion(q));

    setActiveTest({ type: 'monthly', questions: final100, currentIndex: 0, score: 0 });
  };

  const handleAnswer = (selectedOption: string) => {
    if (!activeTest) return;

    const currentQ = activeTest.questions[activeTest.currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;

    if (isCorrect) {
      setUserXp(prev => prev + (currentQ.difficulty === 'hard' ? 20 : 10));
      const msgs = ["🔥 Керемет!", "⚡ Дәл таптың!", "🧬 Білімің күшейіп келеді!", "🚀 Тағы бір қадам!", "🏆 Жарайсың!", "💚 BIOFORCE деңгейі көтерілді!"];
      setMotivationMsg(msgs[Math.floor(Math.random() * msgs.length)]);
      setTimeout(() => setMotivationMsg(null), 1500);
    } else {
      setMistakes(prev => [...prev, { question: currentQ, userAnswer: selectedOption }]);
    }

    if (activeTest.currentIndex + 1 < activeTest.questions.length) {
      setActiveTest(prev => prev ? { ...prev, currentIndex: prev.currentIndex + 1, score: isCorrect ? prev.score + 1 : prev.score } : null);
    } else {
      // Test Completed Rewards
      if (activeTest.type === 'topic' && activeTest.topicId) {
        if (!completedTopics.includes(activeTest.topicId)) {
          setCompletedTopics(prev => [...prev, activeTest.topicId!]);
          setUserXp(prev => prev + 50);
        }
      } else if (activeTest.type === 'week1_final') {
        setCompletedWeek1Final(true);
        setUserXp(prev => prev + 100);
      } else if (activeTest.type === 'week2_final') {
        setCompletedWeek2Final(true);
        setUserXp(prev => prev + 100);
      } else if (activeTest.type === 'monthly') {
        setUserXp(prev => prev + 250);
      }
      setActiveTest(null);
    }
  };

  // ==========================================================================
  // LANDING PAGE (RULE 21 & 22: STRICTLY BIOFORCE + PROFILE SELECTION ONLY)
  // ==========================================================================
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-white text-[#10251A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#39FF88]/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-6xl font-black tracking-widest text-[#0B3D24] drop-shadow-[0_0_25px_rgba(57,255,136,0.6)]">
            BIOFORCE
          </h1>
          <p className="text-xl font-bold text-[#18C875] mt-2 tracking-wider">ӨЗ ПРОФИЛІҢДІ ТАҢДА</p>
        </motion.div>

        {/* 6 Profiles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-8">
          {(Object.keys(PROFILES_CONFIG) as ProfileCategory[]).map((key) => {
            const prof = PROFILES_CONFIG[key];
            const isSelected = selectedProfile === key;
            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedProfile(key)}
                className={`p-5 rounded-2xl cursor-pointer border-2 transition-all glass-panel ${
                  isSelected
                    ? "border-[#39FF88] bg-[#39FF88]/25 shadow-[0_0_30px_rgba(57,255,136,0.45)]"
                    : "border-transparent hover:border-[#39FF88] hover:shadow-[0_0_25px_rgba(57,255,136,0.35)]"
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl">{prof.icon}</span>
                  <h3 className="text-xl font-bold text-[#0B3D24]">{prof.name}</h3>
                </div>
                <p className="text-xs text-emerald-700 mb-3">Бастапқы кейіпкер: <span className="font-bold">{prof.ranks[0].character}</span></p>
                <CharacterCanvas characterName={prof.ranks[0].character} />
              </motion.div>
            );
          })}
        </div>

        {/* START BUTTON */}
        {selectedProfile && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setIsStarted(true)}
            className="glow-btn px-10 py-4 rounded-full text-[#0B3D24] text-2xl font-black flex items-center space-x-3 cursor-pointer"
          >
            <span>БАСТАУ</span>
            <GreenStar3D />
          </motion.button>
        )}
      </div>
    );
  }

  // ==========================================================================
  // MAIN DASHBOARD PLATFORM
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#F4FFF7] text-[#10251A] flex flex-col">
      <header className="border-b border-[#39FF88]/30 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-black text-[#0B3D24] tracking-widest">BIOFORCE</span>
          <span className="text-xs bg-[#E8FFF1] border border-[#39FF88] px-3 py-1 rounded-full text-[#0B3D24] font-bold">
            {currentProfileData?.name} | {currentRank?.rank} ({currentRank?.character})
          </span>
        </div>

        <nav className="flex space-x-2">
          {(['modules', 'character', 'mistakes', 'monthly'] as SectionType[]).map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={`nav-item px-5 py-2 rounded-xl text-sm font-bold uppercase ${
                activeSection === sec ? "active" : "text-[#0B3D24]"
              }`}
            >
              {sec === 'modules' && "МОДУЛЬ"}
              {sec === 'character' && "КЕЙІПКЕР"}
              {sec === 'mistakes' && "ҚАТЕМЕН ЖҰМЫС"}
              {sec === 'monthly' && (
                <span className="flex items-center space-x-1">
                  <span>АЙЛЫҚ ТЕСТ</span>
                  {(!completedWeek2Final || mistakes.length > 0) && <span>🔒</span>}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        {/* BREADCRUMB NAVIGATION */}
        <div className="text-xs text-emerald-800 mb-4 uppercase tracking-wider font-extrabold">
          МОДУЛЬ &gt; {activeSection.toUpperCase()} {activeTest && `&gt; ${activeTest.type.toUpperCase()} &gt; СҰРАҚ ${activeTest.currentIndex + 1} / ${activeTest.questions.length}`}
        </div>

        {/* Motivational Toast */}
        <AnimatePresence>
          {motivationMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-20 right-8 bg-[#39FF88] text-[#0B3D24] font-black px-6 py-3 rounded-2xl shadow-xl z-50 border border-white"
            >
              {motivationMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ACTIVE TEST VIEW */}
        {activeTest ? (
          <div className="glass-panel p-8 rounded-3xl max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-emerald-900">
                Сұрақ {activeTest.currentIndex + 1} / {activeTest.questions.length}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#39FF88]/40 font-black">
                {activeTest.questions[activeTest.currentIndex].difficulty.toUpperCase()}
              </span>
            </div>

            <div className="w-full h-3 bg-[#E8FFF1] rounded-full overflow-hidden mb-6 border border-[#39FF88]/50">
              <div
                className="h-full bg-[#39FF88] transition-all duration-300"
                style={{ width: `${((activeTest.currentIndex + 1) / activeTest.questions.length) * 100}%` }}
              />
            </div>

            <h2 className="text-xl font-black text-[#0B3D24] mb-6">
              {activeTest.questions[activeTest.currentIndex].question}
            </h2>

            <div className="space-y-3 mb-6">
              {activeTest.questions[activeTest.currentIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className="w-full text-left p-4 rounded-2xl border border-[#39FF88]/50 bg-white/90 hover:bg-[#E8FFF1] hover:border-[#39FF88] font-bold transition-all text-[#10251A]"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* GENERAL PROGRESS DASHBOARD */}
            <div className="glass-panel p-6 rounded-3xl mb-8">
              <h2 className="text-lg font-black text-[#0B3D24] mb-2 uppercase tracking-wide">ЖАЛПЫ ПРОГРЕСС</h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1 h-4 bg-[#E8FFF1] rounded-full overflow-hidden border border-[#39FF88]/60">
                  <div className="h-full bg-gradient-to-r from-[#39FF88] to-[#18C875]" style={{ width: `${generalProgressPercent}%` }} />
                </div>
                <span className="text-xl font-black text-[#0B3D24]">{generalProgressPercent}%</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs font-black text-[#0B3D24]">
                <div className="p-3 bg-white/80 rounded-xl border border-[#39FF88]/40">1-АПТА: {week1ProgressPercent}%</div>
                <div className="p-3 bg-white/80 rounded-xl border border-[#39FF88]/40">2-АПТА: {week2Unlocked ? `${week2ProgressPercent}%` : "🔒"}</div>
                <div className="p-3 bg-white/80 rounded-xl border border-[#39FF88]/40">ҚАТЕМЕН ЖҰМЫС: {mistakes.length > 0 ? `${mistakes.length} қате` : "100% ✓"}</div>
                <div className="p-3 bg-white/80 rounded-xl border border-[#39FF88]/40">АЙЛЫҚ ТЕСТ: {completedWeek2Final && mistakes.length === 0 ? "🔓 АШЫҚ" : "🔒"}</div>
              </div>
            </div>

            {/* MODULES VIEW */}
            {activeSection === 'modules' && (
              <div className="space-y-8">
                {/* WEEK 1 MODULE */}
                <div className="glass-panel p-6 rounded-3xl">
                  <h3 className="text-xl font-black text-[#0B3D24] mb-4">1-АПТА (Алғашқы 4 оқулық тақырыбы)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {week1Topics.map((topic, idx) => {
                      const isUnlocked = idx === 0 || completedTopics.includes(week1Topics[idx - 1].id);
                      const isDone = completedTopics.includes(topic.id);

                      return (
                        <div key={topic.id} className="p-4 bg-white/90 rounded-2xl border border-[#39FF88]/50">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-extrabold text-[#0B3D24] text-sm">{topic.title}</h4>
                            <span className="text-xs font-black">{isDone ? "✓ 20/20" : isUnlocked ? "🔓 0/20" : "🔒"}</span>
                          </div>
                          <BiologyModel type={topic.model3D} />
                          {isUnlocked && !isDone && (
                            <button
                              onClick={() => startTopicTest(topic.id)}
                              className="glow-btn w-full py-2 rounded-xl text-xs font-black text-[#0B3D24] mt-2"
                            >
                              ТАПСЫРУ (20 UNIQUE СҰРАҚ)
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* WEEK 1 FINAL (50 UNIQUE QUESTIONS) */}
                  {completedTopics.filter(id => week1Topics.some(w => w.id === id)).length === 4 && (
                    <div className="p-4 bg-[#39FF88]/30 border border-[#39FF88] rounded-2xl text-center">
                      <h4 className="font-black text-[#0B3D24] mb-2">1-АПТА ҚОРЫТЫНДЫ ТЕСТІ (50 БІРЕГЕЙ ЖАҢА СҰРАҚ)</h4>
                      <button
                        onClick={startWeek1Final}
                        className="glow-btn px-6 py-2.5 rounded-xl text-sm font-black text-[#0B3D24]"
                      >
                        {completedWeek1Final ? "ҚАЙТА ТАПСЫРУ" : "БАСТАУ (50 СҰРАҚ)"}
                      </button>
                    </div>
                  )}
                </div>

                {/* WEEK 2 MODULE */}
                <div className="glass-panel p-6 rounded-3xl relative">
                  {!week2Unlocked && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-10 flex items-center justify-center rounded-3xl">
                      <span className="text-lg font-black text-[#0B3D24] bg-[#39FF88] px-6 py-3 rounded-full shadow-lg">
                        🔒 2-АПТА ҚҰЛЫПТАУЛЫ (1-апта және қорытынды тест толық бітуі тиіс)
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-black text-[#0B3D24] mb-4">2-АПТА (Қалған барлық оқулық тақырыптары)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {week2Topics.map((topic, idx) => {
                      const isUnlocked = idx === 0 || completedTopics.includes(week2Topics[idx - 1].id);
                      const isDone = completedTopics.includes(topic.id);

                      return (
                        <div key={topic.id} className="p-4 bg-white/90 rounded-2xl border border-[#39FF88]/50">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-extrabold text-[#0B3D24] text-sm">{topic.title}</h4>
                            <span className="text-xs font-black">{isDone ? "✓ 20/20" : isUnlocked ? "🔓 0/20" : "🔒"}</span>
                          </div>
                          <BiologyModel type={topic.model3D} />
                          {isUnlocked && !isDone && (
                            <button
                              onClick={() => startTopicTest(topic.id)}
                              className="glow-btn w-full py-2 rounded-xl text-xs font-black text-[#0B3D24] mt-2"
                            >
                              ТАПСЫРУ (20 UNIQUE СҰРАҚ)
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* WEEK 2 FINAL (50 UNIQUE QUESTIONS) */}
                  {completedTopics.filter(id => week2Topics.some(w => w.id === id)).length === week2Topics.length && (
                    <div className="p-4 bg-[#39FF88]/30 border border-[#39FF88] rounded-2xl text-center">
                      <h4 className="font-black text-[#0B3D24] mb-2">2-АПТА ҚОРЫТЫНДЫ ТЕСТІ (50 БІРЕГЕЙ ЖАҢА СҰРАҚ)</h4>
                      <button
                        onClick={startWeek2Final}
                        className="glow-btn px-6 py-2.5 rounded-xl text-sm font-black text-[#0B3D24]"
                      >
                        {completedWeek2Final ? "ҚАЙТА ТАПСЫРУ" : "БАСТАУ (50 СҰРАҚ)"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CHARACTER SECTION */}
            {activeSection === 'character' && (
              <div className="glass-panel p-8 rounded-3xl text-center max-w-xl mx-auto">
                <h2 className="text-2xl font-black text-[#0B3D24] mb-2">{currentRank?.character}</h2>
                <p className="text-sm font-bold text-[#18C875] mb-4">
                  Rank: {currentRank?.rank} (Level {currentRank?.level})
                </p>
                <CharacterCanvas characterName={currentRank?.character || 'Hero'} />
                <div className="mt-6 text-left space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>XP Прогресс:</span>
                    <span>{userXp} XP</span>
                  </div>
                  <div className="w-full h-3 bg-[#E8FFF1] rounded-full overflow-hidden border border-[#39FF88]/50">
                    <div className="h-full bg-[#39FF88]" style={{ width: `${Math.min((userXp / 3000) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            )}

            {/* MISTAKES SECTION */}
            {activeSection === 'mistakes' && (
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-xl font-black text-[#0B3D24] mb-4">ҚАТЕМЕН ЖҰМЫС ({mistakes.length} Қате сұрақ)</h3>
                {mistakes.length === 0 ? (
                  <p className="text-center text-emerald-900 font-bold py-8">🎉 Қазірше ешқандай қате жоқ!</p>
                ) : (
                  <div className="space-y-4">
                    {mistakes.map((m, idx) => (
                      <div key={idx} className="p-4 bg-white/90 rounded-2xl border border-red-300">
                        <p className="font-bold text-[#0B3D24] mb-2">{m.question.question}</p>
                        <p className="text-xs text-red-600 font-bold">Сенің жауабың: {m.userAnswer}</p>
                        <p className="text-xs text-green-700 font-extrabold">Дұрыс жауап: {m.question.correctAnswer}</p>
                        <div className="mt-2 p-3 bg-[#E8FFF1] rounded-xl text-xs text-[#0B3D24]">
                          <strong>Түсіндірме:</strong> {m.question.explanation}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setMistakes([])}
                      className="glow-btn w-full py-3 rounded-2xl font-black text-[#0B3D24] mt-4"
                    >
                      ҚАТЕЛЕРДІ ЖОЮ ВАЛИДАЦИЯСЫН АЯҚТАУ ✓
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MONTHLY TEST SECTION */}
            {activeSection === 'monthly' && (
              <div className="glass-panel p-8 rounded-3xl text-center max-w-xl mx-auto">
                <h3 className="text-2xl font-black text-[#0B3D24] mb-4">АЙЛЫҚ ТЕСТ (100 UNIQUE QUESTIONS)</h3>
                {completedWeek2Final && mistakes.length === 0 ? (
                  <button
                    onClick={startMonthlyTest}
                    className="glow-btn px-8 py-4 rounded-full text-lg font-black text-[#0B3D24]"
                  >
                    АЙЛЫҚ ТЕСТТІ БАСТАУ (100 БІРЕГЕЙ СҰРАҚ)
                  </button>
                ) : (
                  <p className="text-sm font-bold text-red-600">
                    🔒 Айлық тест ашылуы үшін: 2-апта қорытынды тесті тапсырылып, Қатемен жұмыс 100% аяқталуы тиіс.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}