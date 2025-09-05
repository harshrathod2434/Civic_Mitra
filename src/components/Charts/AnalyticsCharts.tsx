import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Scatter, ScatterChart, ZAxis } from 'recharts';
import { Issue, CityStats } from '../../types';
import { DEPARTMENTS } from '../../data/mockData';

interface AnalyticsChartsProps {
  issues: Issue[];
  cityStats: CityStats[];
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ issues, cityStats }) => {
  const [activeChart, setActiveChart] = useState<'bar' | 'line' | 'area' | 'radar' | 'scatter'>('bar');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showTooltip, setShowTooltip] = useState(true);
  // Total issues reported vs resolved
  const totalIssuesData = [
    { name: 'Total', reported: issues.length, resolved: issues.filter(i => i.status === 'Resolved').length },
  ];

  // Department-wise resolution rate
  const departmentData = DEPARTMENTS.map(dept => {
    const deptIssues = issues.filter(i => i.department === dept);
    const resolved = deptIssues.filter(i => i.status === 'Resolved').length;
    const total = deptIssues.length;
    const resolutionRate = total > 0 ? (resolved / total) * 100 : 0;
    
    return {
      name: dept,
      resolutionRate: Math.round(resolutionRate),
      total,
      resolved
    };
  });

  // City-wise pending issues
  const cityData = cityStats.map(city => ({
    name: city.city,
    pending: city.totalIssues - city.resolvedIssues,
    resolved: city.resolvedIssues
  }));

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Generate trend data based on time range (mock data for demonstration)
  const generateTrendData = () => {
    let labels: string[] = [];
    let dataPoints = 12;
    
    switch(timeRange) {
      case 'week':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dataPoints = 7;
        break;
      case 'month':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        dataPoints = 12;
        break;
      case 'quarter':
        labels = ['Q1-Jan', 'Q1-Feb', 'Q1-Mar', 'Q2-Apr', 'Q2-May', 'Q2-Jun', 'Q3-Jul', 'Q3-Aug', 'Q3-Sep', 'Q4-Oct', 'Q4-Nov', 'Q4-Dec'];
        dataPoints = 12;
        break;
      case 'year':
        labels = ['2018', '2019', '2020', '2021', '2022', '2023'];
        dataPoints = 6;
        break;
    }
    
    return labels.map((label, index) => {
      const filteredIssues = selectedDepartment 
        ? issues.filter(i => i.department === selectedDepartment)
        : issues;
      
      // Simulate some trend data with more variability
      const baseReported = Math.floor(filteredIssues.length / dataPoints) + Math.floor(Math.random() * 8);
      const baseResolved = Math.floor(baseReported * (0.4 + (index / (dataPoints * 1.5)) + (Math.random() * 0.2)));
      const satisfaction = Math.floor(Math.min(100, 60 + (index * 2) + (Math.random() * 15)));
      const responseTime = Math.max(1, 10 - (index * 0.5) + (Math.random() * 3)).toFixed(1);
      
      return {
        name: label,
        reported: Math.max(0, baseReported),
        resolved: Math.min(baseReported, Math.max(0, baseResolved)),
        pending: Math.max(0, baseReported - baseResolved),
        efficiency: Math.floor(Math.min(100, 50 + (index * 4) + (Math.random() * 10))),
        satisfaction: satisfaction,
        responseTime: parseFloat(responseTime)
      };
    });
  };
  
  // Generate radar data for department performance metrics
  const generateRadarData = () => {
    return DEPARTMENTS.map(dept => {
      return {
        department: dept,
        'Resolution Rate': Math.floor(Math.random() * 40) + 60,
        'Response Time': Math.floor(Math.random() * 30) + 70,
        'Citizen Satisfaction': Math.floor(Math.random() * 25) + 75,
        'Cost Efficiency': Math.floor(Math.random() * 35) + 65,
        'Issue Prevention': Math.floor(Math.random() * 45) + 55,
      };
    });
  };
  
  // Generate scatter data for correlation analysis
  const generateScatterData = () => {
    return issues.map(issue => {
      // Simulate response time (days) based on priority
      let responseTime = 1;
      if (issue.priority === 'Low') responseTime = Math.random() * 5 + 3;
      else if (issue.priority === 'Medium') responseTime = Math.random() * 3 + 1;
      else responseTime = Math.random() * 1.5 + 0.5;
      
      // Simulate satisfaction score based on response time and resolution
      let satisfaction = 100 - (responseTime * 10);
      if (issue.status !== 'Resolved') satisfaction -= 20;
      satisfaction = Math.max(0, Math.min(100, satisfaction + (Math.random() * 20 - 10)));
      
      return {
        name: issue.id,
        responseTime,
        satisfaction,
        priority: issue.priority,
        department: issue.department,
        status: issue.status
      };
    });
  };
  
  const trendData = generateTrendData();
  const radarData = generateRadarData();
  const scatterData = generateScatterData();
  
  // Refresh data when filters change
  useEffect(() => {
    // In a real app, this would fetch new data based on filters
    // For demo, we'll just trigger a re-render
  }, [timeRange, selectedDepartment]);

  // Handle department selection for filtering
  const handleDepartmentSelect = (dept: string) => {
    setSelectedDepartment(selectedDepartment === dept ? null : dept);
  };

  // Chart type selector
  const renderChartTypeSelector = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <button 
        onClick={() => setActiveChart('bar')} 
        className={`px-4 py-2 rounded ${activeChart === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Bar Chart
      </button>
      <button 
        onClick={() => setActiveChart('line')} 
        className={`px-4 py-2 rounded ${activeChart === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Line Chart
      </button>
      <button 
        onClick={() => setActiveChart('area')} 
        className={`px-4 py-2 rounded ${activeChart === 'area' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Area Chart
      </button>
      <button 
        onClick={() => setActiveChart('radar')} 
        className={`px-4 py-2 rounded ${activeChart === 'radar' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Radar Chart
      </button>
      <button 
        onClick={() => setActiveChart('scatter')} 
        className={`px-4 py-2 rounded ${activeChart === 'scatter' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Scatter Plot
      </button>
    </div>
  );
  
  // Time range selector
  const renderTimeRangeSelector = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <button 
        onClick={() => setTimeRange('week')} 
        className={`px-3 py-1 text-sm rounded ${timeRange === 'week' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Weekly
      </button>
      <button 
        onClick={() => setTimeRange('month')} 
        className={`px-3 py-1 text-sm rounded ${timeRange === 'month' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Monthly
      </button>
      <button 
        onClick={() => setTimeRange('quarter')} 
        className={`px-3 py-1 text-sm rounded ${timeRange === 'quarter' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Quarterly
      </button>
      <button 
        onClick={() => setTimeRange('year')} 
        className={`px-3 py-1 text-sm rounded ${timeRange === 'year' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        Yearly
      </button>
    </div>
  );
  
  // Chart controls
  const renderChartControls = () => (
    <div className="flex justify-end gap-2 mb-4">
      <button 
        onClick={() => setShowTooltip(!showTooltip)}
        className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
      >
        {showTooltip ? 'Hide Tooltip' : 'Show Tooltip'}
      </button>
    </div>
  );

  // Render the appropriate chart based on selection
  const renderTrendChart = () => {
    switch (activeChart) {
      case 'line':
        return (
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            {showTooltip && <Tooltip />}
            <Legend />
            <Line type="monotone" dataKey="reported" stroke="#8884d8" name="Reported" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="resolved" stroke="#82ca9d" name="Resolved" />
            <Line type="monotone" dataKey="efficiency" stroke="#ffc658" name="Efficiency %" />
            <Line type="monotone" dataKey="satisfaction" stroke="#ff7300" name="Satisfaction %" />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            {showTooltip && <Tooltip />}
            <Legend />
            <Area type="monotone" dataKey="reported" stackId="1" stroke="#8884d8" fill="#8884d8" name="Reported" />
            <Area type="monotone" dataKey="resolved" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Resolved" />
            <Area type="monotone" dataKey="pending" stackId="3" stroke="#ffc658" fill="#ffc658" name="Pending" />
          </AreaChart>
        );
      case 'radar':
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" width={500} height={300} data={radarData.filter(d => selectedDepartment ? d.department === selectedDepartment : true)}>
            <PolarGrid />
            <PolarAngleAxis dataKey="department" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            {showTooltip && <Tooltip />}
            <Radar name="Resolution Rate" dataKey="Resolution Rate" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name="Response Time" dataKey="Response Time" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <Radar name="Citizen Satisfaction" dataKey="Citizen Satisfaction" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        );
      case 'scatter':
        return (
          <ScatterChart width={500} height={300} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="responseTime" name="Response Time (days)" />
            <YAxis type="number" dataKey="satisfaction" name="Satisfaction Score" domain={[0, 100]} />
            <ZAxis type="category" dataKey="priority" range={[100, 500]} />
            {showTooltip && <Tooltip cursor={{ strokeDasharray: '3 3' }} />}
            <Legend />
            <Scatter 
              name="Issue Metrics" 
              data={scatterData.filter(d => selectedDepartment ? d.department === selectedDepartment : true)} 
              fill="#8884d8"
              shape="circle"
            />
          </ScatterChart>
        );
      default: // 'bar'
        return (
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            {showTooltip && <Tooltip />}
            <Legend />
            <Bar dataKey="reported" fill="#8884d8" name="Reported" />
            <Bar dataKey="resolved" fill="#82ca9d" name="Resolved" />
            <Bar dataKey="pending" fill="#ffc658" name="Pending" />
          </BarChart>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Total Issues Reported vs Resolved</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={totalIssuesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="reported" fill="#8884d8" name="Reported" />
            <Bar dataKey="resolved" fill="#82ca9d" name="Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Department-wise Resolution Rate (%)</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {departmentData.map((dept) => (
            <button
              key={dept.name}
              onClick={() => handleDepartmentSelect(dept.name)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedDepartment === dept.name 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              {dept.name}
            </button>
          ))}
          {selectedDepartment && (
            <button
              onClick={() => setSelectedDepartment(null)}
              className="px-3 py-1 text-sm rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              Clear Filter
            </button>
          )}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={selectedDepartment 
            ? departmentData.filter(d => d.name === selectedDepartment)
            : departmentData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="resolutionRate" fill="#8884d8" name="Resolution Rate (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">City-wise Issues</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={cityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pending" fill="#ff8042" name="Pending" />
            <Bar dataKey="resolved" fill="#82ca9d" name="Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Performance Trends {selectedDepartment ? `(${selectedDepartment})` : '(All Departments)'}</h3>
        <div className="flex flex-wrap justify-between items-center">
          <div>
            {renderChartTypeSelector()}
            {renderTimeRangeSelector()}
          </div>
          {renderChartControls()}
        </div>
        <ResponsiveContainer width="100%" height={400}>
          {renderTrendChart()}
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-gray-500">
          <p>* Interactive charts with {timeRange} data. Select different chart types and time ranges to visualize the data.</p>
          {activeChart === 'scatter' && (
            <p className="mt-2">Scatter plot shows correlation between response time and citizen satisfaction. Larger circles indicate higher priority issues.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col justify-center">
            <h4 className="text-md font-medium mb-2">Department Breakdown</h4>
            <ul className="space-y-2">
              {departmentData.map((dept, index) => (
                <li key={dept.name} className="flex items-center">
                  <span 
                    className="w-4 h-4 mr-2 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{dept.name}: {dept.total} issues ({dept.resolved} resolved)</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;