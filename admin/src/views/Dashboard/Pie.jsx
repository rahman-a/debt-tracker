import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import i18next from 'i18next';

ChartJS.register(ArcElement, Tooltip, Legend);



export const PieChart = ({values, title}) => {
    
  const lang = i18next.language
    
  const chatLabels = _ => {
    if(lang === 'ar') {
      return ['السبت', 'الأحد', 'الأثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
    }
    
    return ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  }
  
  
  const data = {
        labels: chatLabels(),
        datasets: [
          {
            label: `# of ${title}`,
            data: values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 21, 80, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 21, 80, 0.5)',
            ],
            borderWidth: 1,
          },
        ],
      };
    
    
    
    return <Pie data={data} />
} 
