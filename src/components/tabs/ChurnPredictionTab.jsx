import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  Button
} from '@mui/material';
import {
  NotificationsOutlined,
  TrendingUp,
  Warning,
  CheckCircle,
  Assignment,
  Group,
  TrendingFlat,
  Phone,
  Assessment,
  School,
  Create,
  AttachMoney,
  Settings
} from '@mui/icons-material';

const ChurnPrediction = () => {

  // Mock data for the dashboard
  const statsData = [
    {
      title: '23',
      subtitle: 'High Risk Accounts',
      change: '+3 from last week',
      icon: <Warning />,
      color: '#ff4444',
      bgColor: '#ffebee',
      isIncrease: false
    },
    {
      title: '47',
      subtitle: 'Medium Risk',
      change: '-2 from last week',
      icon: <TrendingFlat />,
      color: '#ff9800',
      bgColor: '#fff3e0',
      isIncrease: false
    },
    {
      title: '156',
      subtitle: 'Low Risk',
      change: '+8 from last week',
      icon: <CheckCircle />,
      color: '#4caf50',
      bgColor: '#e8f5e8',
      isIncrease: true
    },
    {
      title: '92.3%',
      subtitle: 'Retention Rate',
      change: '+1.2% from last month',
      icon: <TrendingUp />,
      color: '#2196f3',
      bgColor: '#e3f2fd',
      isIncrease: true
    }
  ];

  const highRiskAccounts = [
    {
      company: 'TechCorp Solutions',
      manager: 'Sarah Johnson',
      score: 87,
      arr: '$45K ARR',
      priority: 'high'
    },
    {
      company: 'Global Dynamics Inc',
      manager: 'Mike Chen',
      score: 82,
      arr: '$78K ARR',
      priority: 'high'
    },
    {
      company: 'Innovation Labs',
      manager: 'Lisa Wong',
      score: 79,
      arr: '$62K ARR',
      priority: 'high'
    }
  ];

  const keyActivities = [
    {
      title: 'Schedule Check-in Calls',
      description: 'Immediate outreach to high-risk accounts within 24 hours',
      priority: 'High',
      icon: <Phone />,
      color: '#2196f3'
    },
    {
      title: 'Usage Analysis Review',
      description: 'Analyze product usage patterns and identify drop-off points',
      priority: 'Medium',
      icon: <Assessment />,
      color: '#ff9800'
    },
    {
      title: 'Training Sessions',
      description: 'Offer product training to increase user adoption',
      priority: 'Medium',
      icon: <School />,
      color: '#4caf50'
    },
    {
      title: 'Success Plan Creation',
      description: 'Develop customized success plans with clear milestones',
      priority: 'High',
      icon: <Create />,
      color: '#9c27b0'
    }
  ];

  const strategicActions = [
    {
      title: 'Executive Escalation',
      description: 'C-level intervention for accounts with score >85',
      priority: 'Critical',
      icon: <Group />,
      color: '#f44336'
    },
    {
      title: 'Product Roadmap Review',
      description: 'Align product development with at-risk customer needs',
      priority: 'Strategic',
      icon: <Assignment />,
      color: '#2196f3'
    },
    {
      title: 'Pricing Strategy Review',
      description: 'Consider custom pricing for retention',
      priority: 'Financial',
      icon: <AttachMoney />,
      color: '#4caf50'
    },
    {
      title: 'Resource Allocation',
      description: 'Assign additional support resources to high-value at-risk accounts',
      priority: 'Operational',
      icon: <Settings />,
      color: '#ff9800'
    }
  ];

  const CircularProgress = ({ value, size = 120 }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#4caf50"
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Risk Score
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh',
      width: '100%',
      maxWidth: 'none',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              backgroundColor: '#2196f3',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h6" color="white" fontWeight="bold">
              CG
            </Typography>
          </Box>
          <Typography sx={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a' }}>
            ChurnGuard Dashboard
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton>
            <NotificationsOutlined />
          </IconButton>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#2196f3' }}>
            U
          </Avatar>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3, width: '100%', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
        {statsData.map((stat, index) => (
          <Box sx={{ 
            flex: { xs: '0 0 calc(100% - 24px)', sm: '0 0 calc(50% - 12px)', md: '0 0 calc(25% - 18px)' },
            maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' },
            minWidth: { xs: '280px', sm: '280px', md: '200px' }
          }} key={index}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                height: '100%',
                // '&:hover': {
                //   transform: 'translateY(-4px)',
                //   boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                // }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: "flex-start",  justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {stat.subtitle}
                    </Typography>
                    <Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: stat.color, mb: 1 }}>
                      {stat.title}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                       color:"#1a1a1a",
                        fontWeight: 500
                      }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: stat.bgColor,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: stat.color
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 2, sm: 0, md: 0 }, 
        width: '100%', 
        flexDirection: { xs: 'column', md: 'row' },
        px: { xs: 2, sm: 3, md: 0 },
        mx: 'auto',
        maxWidth: '100%',
        mb: 3,
      }}>
        {/* Churn Prediction Score */}
        <Box sx={{ 
          flex: { xs: '1 1 100%', md: '0 0 40%' }, 
          width: { xs: '100%', md: '40%' },
          px: { xs: 0, md: 1 }
        }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              mx: 'auto'
            }}
          >
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '16px', fontWeight: '600', mb: 3 }}>
                Churn Prediction Score
              </Typography>
              <Typography sx={{ fontSize: '14px', color: 'text.secondary', mb: 2 }}>
                Overall Risk Level
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
              <Box sx={{
                width: '160px',
                height: '80px',
                borderRadius: '80px 80px 0 0',
                background: `conic-gradient(from 180deg, #10b981 0deg ${94 * 1.8}deg, #e5e7eb ${94 * 1.8}deg 180deg)`,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  width: '120px',
                  height: '60px',
                  borderRadius: '60px 60px 0 0',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0px'
                }}>
                  <Typography style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', lineHeight: 1, marginTop: '10px' }}>
                    94%
                  </Typography>
                </Box>
              </Box>
            </Box>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Low Risk (0-30)</Typography>
                  <Typography variant="body2" fontWeight="500">156 accounts</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Medium Risk (31-70)</Typography>
                  <Typography variant="body2" fontWeight="500">47 accounts</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">High Risk (71-100)</Typography>
                  <Typography variant="body2" fontWeight="500">23 accounts</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* High Risk Accounts */}
        <Box sx={{ 
          flex: { xs: '1 1 100%', md: '0 0 60%' }, 
          width: { xs: '100%', md: '60%' },
          px: { xs: 0, md: 1 }
        }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              mx: 'auto'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>
                  High Risk Accounts
                </Typography>
                <Button variant="text" sx={{ color: '#2196f3', textTransform: 'none' }}>
                  View All
                </Button>
              </Box>
              {highRiskAccounts.map((account, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    mb: 2,
                    backgroundColor: '#fff5f5',
                    borderRadius: 2,
                    border: '1px solid #ffebee'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Warning sx={{ color: '#f44336' }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="600">
                        {account.company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Account Manager: {account.manager}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#f44336' }}>
                      Score: {account.score}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {account.arr}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 2, sm: 0, md: 0 }, 
        width: '100%', 
        flexDirection: { xs: 'column', md: 'row' },
        px: { xs: 2, sm: 3, md: 0 },
        mx: 'auto',
        maxWidth: '100%'
      }}>
        {/* Key Activities - Account Managers */}
        <Box sx={{ 
          flex: { xs: '1 1 100%', md: '0 0 50%' }, 
          width: { xs: '100%', md: '50%' },
          px: { xs: 0, md: 1 }
        }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              mx: 'auto'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '16px', fontWeight: '600', mb: 3 }}>
                Key Activities - Account Managers
              </Typography>
              {keyActivities.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2.5,
                    mb: 2,
                    backgroundColor: index === 0 ? '#e3f2fd' : 
                                   index === 1 ? '#fff3e0' : 
                                   index === 2 ? '#e8f5e8' : '#f3e5f5',
                    borderRadius: 2,
                    border: '1px solid ' + (index === 0 ? '#bbdefb' : 
                                           index === 1 ? '#ffcc80' : 
                                           index === 2 ? '#c8e6c8' : '#e1bee7')
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: activity.color,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0
                    }}
                  >
                    {activity.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, fontSize: '14px' }}>
                      {activity.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '12px' }}>
                      {activity.description}
                    </Typography>
                    <Chip
                      label={`Priority: ${activity.priority}`}
                      size="small"
                      sx={{
                        bgcolor: activity.priority === 'High' ? '#1976d2' : '#ff9800',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '10px',
                        height: '20px'
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Strategic Actions - Top Management */}
        <Box sx={{ 
          flex: { xs: '1 1 100%', md: '0 0 50%' }, 
          width: { xs: '100%', md: '50%' },
          px: { xs: 0, md: 1 }
        }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
              mx: 'auto'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '16px', fontWeight: '600', mb: 3 }}>
                Strategic Actions - Top Management
              </Typography>
              {strategicActions.map((action, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2.5,
                    mb: 2,
                    backgroundColor: index === 0 ? '#ffebee' : 
                                   index === 1 ? '#e3f2fd' : 
                                   index === 2 ? '#e8f5e8' : '#fff3e0',
                    borderRadius: 2,
                    border: '1px solid ' + (index === 0 ? '#ffcdd2' : 
                                           index === 1 ? '#bbdefb' : 
                                           index === 2 ? '#c8e6c8' : '#ffcc80')
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: action.color,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, fontSize: '14px' }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '12px' }}>
                      {action.description}
                    </Typography>
                    <Chip
                      label={action.priority}
                      size="small"
                      sx={{
                        bgcolor: action.priority === 'Critical' ? '#d32f2f' :
                          action.priority === 'Strategic' ? '#1976d2' :
                            action.priority === 'Financial' ? '#388e3c' : '#f57c00',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '10px',
                        height: '20px'
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ChurnPrediction;