import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LearningHierarchy() {
  const [level, setLevel] = useState('subjects');
  const [selected, setSelected] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => { fetchData(); }, [level, selected]);

  const fetchData = async () => {
    let endpoint = '';
    if (level === 'subjects') endpoint = '/api/subjects';
    if (level === 'units') endpoint = `/api/units?subject=${selected.subject}`;
    if (level === 'chapters') endpoint = `/api/chapters?unit=${selected.unit}`;
    if (level === 'subtopics') endpoint = `/api/subtopics?chapter=${selected.chapter}`;
    if (level === 'questions') endpoint = `/api/questions?subtopic=${selected.subtopic}`;

    try {
      const res = await axios.get(endpoint);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  const handleClick = (item) => {
    if (level === 'subjects') { setSelected({ subject: item.name }); setLevel('units'); }
    else if (level === 'units') { setSelected(prev => ({ ...prev, unit: item.name })); setLevel('chapters'); }
    else if (level === 'chapters') { setSelected(prev => ({ ...prev, chapter: item.name })); setLevel('subtopics'); }
    else if (level === 'subtopics') { setSelected(prev => ({ ...prev, subtopic: item.name })); setLevel('questions'); }
  };

  const handleBack = () => {
    if (level === 'questions') setLevel('subtopics');
    else if (level === 'subtopics') setLevel('chapters');
    else if (level === 'chapters') setLevel('units');
    else if (level === 'units') setLevel('subjects');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{level}</h1>
      {level !== 'subjects' && <button onClick={handleBack}>Back</button>}
      <ul>
        {data.map((item, idx) => (
          <li key={idx} onClick={() => handleClick(item)} style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc', marginTop: '10px' }}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}