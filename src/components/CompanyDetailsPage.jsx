import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { companyAPI } from "../utils/api";
import Header from "./Header";
import "./CompanyDetailsPage.css";

function CompanyDetailsPage({ onNext }) {
  const navigate = useNavigate();
  const industryOptions = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Government',
    'Energy',
    'Telecommunications',
    'Transportation',
    'Real Estate',
    'Media & Entertainment',
    'Agriculture',
    'Construction',
    'Automotive',
    'Aerospace',
    'Pharmaceuticals',
    'Banking',
    'Insurance',
    'Consulting',
    'Legal Services',
    'Non-Profit',
    'Other'
  ];

  const countriesWithCities = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco', 'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Boston', 'Washington DC', 'Miami', 'Atlanta', 'Las Vegas', 'Portland'],
    'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Newcastle', 'Sheffield', 'Bristol', 'Edinburgh', 'Cardiff', 'Belfast', 'Nottingham', 'Leicester', 'Southampton', 'Brighton', 'Oxford', 'Cambridge'],
    'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener', 'London', 'Victoria', 'Halifax', 'Oshawa', 'Windsor'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Wollongong', 'Hobart', 'Darwin'],
    'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Dusseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hanover', 'Nuremberg'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne'],
    'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior'],
    'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Tianjin', 'Wuhan', 'Hangzhou', 'Nanjing', 'Xi\'an', 'Chongqing', 'Qingdao', 'Shenyang', 'Jinan', 'Harbin', 'Changchun', 'Dalian', 'Zhengzhou', 'Kunming', 'Taiyuan'],
    'Japan': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama', 'Hiroshima', 'Sendai', 'Chiba', 'Kitakyushu', 'Sakai'],
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre', 'Belém', 'Goiânia', 'Guarulhos', 'Campinas'],
    'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Zapopan', 'Mérida', 'San Luis Potosí', 'Aguascalientes', 'Hermosillo', 'Saltillo', 'Mexicali'],
    'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania', 'Venice', 'Verona', 'Messina', 'Padua'],
    'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo'],
    'South Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Goyang', 'Yongin', 'Seongnam'],
    'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen'],
    'Singapore': ['Singapore'],
    'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah'],
    'Switzerland': ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern', 'Winterthur', 'Lucerne', 'St. Gallen', 'Lugano'],
    'Sweden': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg'],
    'Poland': ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
    'Belgium': ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven'],
    'Austria': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt'],
    'Norway': ['Oslo', 'Bergen', 'Stavanger', 'Trondheim', 'Drammen', 'Fredrikstad'],
    'Denmark': ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Frederiksberg', 'Esbjerg'],
    'Finland': ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä'],
    'Ireland': ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk'],
    'New Zealand': ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Dunedin', 'Palmerston North'],
    'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London'],
    'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'San Miguel de Tucumán', 'Mar del Plata'],
    'Chile': ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Rancagua'],
    'Portugal': ['Lisbon', 'Porto', 'Braga', 'Coimbra', 'Funchal', 'Setúbal', 'Almada'],
    'Greece': ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa', 'Volos', 'Rhodes'],
    'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Adana', 'Gaziantep', 'Konya', 'Antalya'],
    'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk'],
    'Indonesia': ['Jakarta', 'Surabaya', 'Bandung', 'Bekasi', 'Medan', 'Depok', 'Tangerang', 'Semarang'],
    'Malaysia': ['Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Johor Bahru', 'Malacca City'],
    'Thailand': ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Nakhon Ratchasima', 'Hat Yai', 'Udon Thani'],
    'Philippines': ['Manila', 'Quezon City', 'Davao City', 'Caloocan', 'Cebu City', 'Zamboanga City', 'Taguig'],
    'Vietnam': ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hai Phong', 'Can Tho', 'Bien Hoa', 'Nha Trang'],
    'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Shubra El-Kheima', 'Port Said', 'Suez', 'Luxor'],
    'Nigeria': ['Lagos', 'Kano', 'Ibadan', 'Abuja', 'Port Harcourt', 'Benin City', 'Kaduna'],
    'Kenya': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi'],
    'Israel': ['Tel Aviv', 'Jerusalem', 'Haifa', 'Rishon LeZion', 'Petah Tikva', 'Ashdod', 'Beersheba'],
    'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk'],
  };

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    website: "",
    country: "",
    city: "",
    employees: ""
  });

  const [availableCities, setAvailableCities] = useState([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [industrySearch, setIndustrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const countryRef = useRef(null);
  const cityRef = useRef(null);
  const industryRef = useRef(null);
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
      if (industryRef.current && !industryRef.current.contains(event.target)) {
        setShowIndustryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCountrySearch = (value) => {
    setCountrySearch(value);
    setFormData(prev => ({ ...prev, country: "" }));
    setShowCountryDropdown(true);
  };

  const handleCountrySelect = (country) => {
    setFormData(prev => ({ ...prev, country: country, city: "" }));
    setCountrySearch(country);
    setCitySearch("");
    setShowCountryDropdown(false);
    if (country && countriesWithCities[country]) {
      setAvailableCities(countriesWithCities[country]);
    } else {
      setAvailableCities([]);
    }
  };

  const handleCitySearch = (value) => {
    setCitySearch(value);
    setFormData(prev => ({ ...prev, city: "" }));
    setShowCityDropdown(true);
  };

  const handleCitySelect = (city) => {
    setFormData(prev => ({ ...prev, city: city }));
    setCitySearch(city);
    setShowCityDropdown(false);
  };

  const handleIndustrySearch = (value) => {
    setIndustrySearch(value);
    setFormData(prev => ({ ...prev, industry: "" }));
    setShowIndustryDropdown(true);
  };

  const handleIndustrySelect = (industry) => {
    setFormData(prev => ({ ...prev, industry: industry }));
    setIndustrySearch(industry);
    setShowIndustryDropdown(false);
  };

  const filteredCountries = Object.keys(countriesWithCities)
    .filter(country => country.toLowerCase().includes(countrySearch.toLowerCase()))
    .sort();

  const filteredCities = availableCities
    .filter(city => city.toLowerCase().includes(citySearch.toLowerCase()));

  const filteredIndustries = industryOptions
    .filter(industry => industry.toLowerCase().includes(industrySearch.toLowerCase()));

  const handleSave = async () => {
    // Validate all fields
    const newErrors = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    
    if (!formData.website.trim()) {
      newErrors.website = 'Website is required';
    } else {
      // Allow URLs with or without http/https
      const websiteValue = formData.website.trim();
      
      // List of allowed domain extensions
      const allowedExtensions = [
        '.com', '.in', '.net', '.us', '.co.in', '.ai', '.io', 
        '.uk', '.tech', '.biz'
      ];
      
      // Check if it's a valid domain pattern with allowed extensions
      const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
      const urlPattern = /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/;
      
      // Check if domain has one of the allowed extensions
      const hasValidExtension = allowedExtensions.some(ext => 
        websiteValue.toLowerCase().endsWith(ext.toLowerCase())
      );
      
      if ((!domainPattern.test(websiteValue) && !urlPattern.test(websiteValue)) || !hasValidExtension) {
        newErrors.website = 'Please enter a valid website with supported domain (.com, .in, .net, .us, .co.in, .ai, .io, .uk, .tech, .biz)';
      }
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.employees) {
      newErrors.employees = 'Number of employees is required';
    }
    
    setErrors(newErrors);
    
    // If there are errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not logged in. Please log in again.');
        navigate('/login');
        return;
      }

      // All fields are valid, proceed
      // Auto-prepend https:// if not provided
      let websiteUrl = formData.website.trim();
      if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = 'https://' + websiteUrl;
      }
      
      const companyData = {
        companyName: formData.companyName,
        industry: formData.industry,
        website: websiteUrl,
        country: formData.country,
        city: formData.city,
        employees: formData.employees
      };

      console.log('Saving company data:', companyData);
      console.log('Auth token:', token ? 'Present' : 'Missing');

      // Save company data to backend
      const response = await companyAPI.createOrUpdate(companyData);
      
      if (response.success) {
        console.log('Company details saved successfully:', response.data);
        
        // Also save to session storage for form flow
        const formFlowData = JSON.parse(sessionStorage.getItem('formFlowData') || '{}');
        formFlowData.companyDetails = companyData;
        sessionStorage.setItem('formFlowData', JSON.stringify(formFlowData));
        
        // Call the original onNext function if provided
        if (onNext) {
          onNext(companyData);
        } else {
          // Navigate to service details page
          navigate('/service-details');
        }
      } else {
        throw new Error(response.message || 'Failed to save company details');
      }
    } catch (error) {
      console.error('Error saving company details:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        alert(`Failed to save company details: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleBack = () => {
  //   navigate('/login');
  // };

  return (
    <div className="company-page">
      <Header />
      
      <div className="company-content">
        <div className="company-card">
          <h2 className="company-title">Company Details</h2>
          <p className="company-subtitle"> fill in your company information below.</p>
          
          {/* <div className="company-icons-section">
            <p className="icons-label">Trusted by leading companies:</p>
            <div className="company-icons">
              <div className="company-icon"><MicrosoftLogo /></div>
              <div className="company-icon"><AppleLogo /></div>
              <div className="company-icon"><GoogleLogo /></div>
              <div className="company-icon"><AmazonLogo /></div>
              <div className="company-icon"><MetaLogo /></div>
            </div>
          </div> */}
          
          <div className="form-grid">
            <div className="form-field-wrapper">
              <input
                type="text"
                placeholder="Company Name *"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className={`form-input ${errors.companyName ? 'error' : ''}`}
              />
              {errors.companyName && (
                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                  {errors.companyName}
                </div>
              )}
            </div>
            
            {/* Searchable Industry Dropdown */}
            <div ref={industryRef} className="form-field-wrapper" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Industry... *"
                value={industrySearch}
                onChange={(e) => handleIndustrySearch(e.target.value)}
                onFocus={() => setShowIndustryDropdown(true)}
                className={`form-input ${errors.industry ? 'error' : ''}`}
                autoComplete="off"
              />
              {showIndustryDropdown && filteredIndustries.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  zIndex: 1000,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {filteredIndustries.map((industry) => (
                    <div
                      key={industry}
                      onClick={() => handleIndustrySelect(industry)}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      {industry}
                    </div>
                  ))}
                </div>
              )}
              {errors.industry && (
                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                  {errors.industry}
                </div>
              )}
            </div>

            <div className="form-field-wrapper">
              <input
                type="text"
                placeholder="Website (e.g., example.com) *"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className={`form-input ${errors.website ? 'error' : ''}`}
              />
              {errors.website && (
                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                  {errors.website}
                </div>
              )}
            </div>
            
            {/* Searchable Country Dropdown */}
            <div ref={countryRef} className="form-field-wrapper" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Country... *"
                value={countrySearch}
                onChange={(e) => handleCountrySearch(e.target.value)}
                onFocus={() => setShowCountryDropdown(true)}
                className={`form-input ${errors.country ? 'error' : ''}`}
                autoComplete="off"
              />
              {showCountryDropdown && filteredCountries.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  zIndex: 1000,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {filteredCountries.map((country) => (
                    <div
                      key={country}
                      onClick={() => handleCountrySelect(country)}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      {country}
                    </div>
                  ))}
                </div>
              )}
              {errors.country && (
                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                  {errors.country}
                </div>
              )}
            </div>

            {/* Searchable City Dropdown */}
            <div ref={cityRef} className="form-field-wrapper" style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="City... *"
                value={citySearch}
                onChange={(e) => handleCitySearch(e.target.value)}
                onFocus={() => setShowCityDropdown(true)}
                className={`form-input ${errors.city ? 'error' : ''}`}
                disabled={!formData.country}
                autoComplete="off"
              />
              {showCityDropdown && filteredCities.length > 0 && formData.country && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  zIndex: 1000,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {filteredCities.map((city) => (
                    <div
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
              {errors.city && (
                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                  {errors.city}
                </div>
              )}
            </div>
            <div className="form-field-wrapper">
              <select
                value={formData.employees}
                onChange={(e) => handleInputChange('employees', e.target.value)}
                className={`form-select ${errors.employees ? 'error' : ''}`}
              >
                <option value="">Number of Employees *</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-1000">201-1000</option>
                <option value="1000+">1000+</option>
              </select>
              {errors.employees && (
                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                  {errors.employees}
                </div>
              )}
            </div>
            {/* <div className="form-field-wrapper full-width">
              <textarea
                placeholder="Short Company Description *"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                rows="3"
              />
              {errors.description && (
                <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>
                  {errors.description}
                </div>
              )}
            </div> */}
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%', gridColumn: '1 / -1' }}>
            {/* <button 
              className="save-btn" 
              onClick={handleBack}
              style={{ background: '#f0f0f0', color: '#201F47', flex: '0 0 120px' }}
            >
              Back
            </button> */}
            <button className="save-btn" onClick={handleSave} disabled={isSubmitting} style={{ flex: 1, opacity: isSubmitting ? 0.6 : 1 }}>
              {isSubmitting ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailsPage;
