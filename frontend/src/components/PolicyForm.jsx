import { Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightAddon, Select, Switch, Textarea } from '@chakra-ui/react'
import React, {useRef, useCallback, useState } from 'react'
import male from '../images/form/male.png'
import female from '../images/form/female.png'
import trans from '../images/form/trans.png'
import axios from 'axios'
import bot from '../images/form/new2.gif'
//importing ocr libraries
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';



const PolicyForm = () => {
  
  // const CameraCapture = () => {

    const webcamRef = useRef(null);
    const [recognizedText, setRecognizedText] = useState('');
    const [formData, setFormData] = useState({
      name: '',
      dob: '',
      address: '', 
    });
  
  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
console.log(imageSrc);
    if (imageSrc) {
      // console.log("hi");
      
      Tesseract.recognize(imageSrc, 'eng')
        .then(({ data: { text } }) => {
          console.log('Recognized Text:', text);
          setRecognizedText(text);

          
          const nameMatch = text.match(namePattern);
          if (nameMatch) {
            const name = nameMatch[1]; 
            setFormData((prevData) => ({
              ...prevData,
              name,
            }));
          }

       
          const dobMatch = text.match(dobPattern);
          if (dobMatch) {
            const dob = dobMatch[1]; 
            setFormData((prevData) => ({
              ...prevData,
              dob,
            }));
          }
       
         const addressMatch = text.match(addressPattern);
         if (addressMatch) {
           const address = addressMatch[1]; 
           setFormData((prevData) => ({
             ...prevData,
             address,
           }));
         }
       }
        )
         
        .catch((error) => {
          console.error('Error during recognition:', error);
        });
    }
  }, []);

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    [dob]: value,
    [address]:value
    }));
  };

  const namePattern = /Name:\s*([A-Z\s]+)/;
  const dobPattern = /Date of Birth:(\d{2})\s*-\s*(\d{2})-(\d{4})/;
  const addressPattern = /Address:\s*([^]+)$/;
  
  // Values   
  const [email, setEmail] = useState('')
  const [pincode, setPincode] = useState('')
  const [address, setAddress] = useState('')
  const [fullname, setFullname] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [education, setEducation] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('english')

  
  // Switch Value
  const [genderValue, setGenderClick] = useState('')
  const [nriSwitchValue, setNriSwitchValue] = useState('')  

  const handleGenderSwitchChange = (value) => {
    setGenderClick(value)
  }

  const handleNriSwitchChange = (value) => {
    setNriSwitchValue(value)
  }

  async function policyFormSubmit(e){
        e.preventDefault();  
        
        try {

            if(fullname !== "" && phone !== "" && dob != "" && email != "" && pincode !== "" && address !== "" && education !== ""){

                const policyData = {      
                    fullname,
                    phone,
                    dob,
                    email,
                    pincode,
                    address,
                    education,
                    genderValue,
                    nriSwitchValue,  
                };                 
                   
                  const res = await axios.post("/policy-form", policyData);       
                  alert(res.data)  
            }

            else {
                alert("Not Added")
            }

        } catch (e) {
            alert(e)
        }                   
  }

  const input = ['phone','email','pincode'];
    let index = 0;

  const speak = async () => {
    let textInput;

    if (selectedLanguage === 'english') {
      textInput = "What is your " + input[index];
    } else if (selectedLanguage === 'hindi') {
        textInput = `aapka ${input[index]} kea hae?`;
      console.log(selectedLanguage)
    }

    if (textInput.trim() !== '') {
      try {
        const response = await axios.post('/speak', null, {
          headers: { prompt: textInput },
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    }
  };

  async function voice_btn() {
    
    let answer;
  
    speak()
  
    const listenForSpeech = async () => {
        return axios.post('/listen')
          .then((response) => {
            console.log("Listening...");
            const recognizedText = response.data.recognized_text;
            // const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
            // const email = recognizedText.replace(/\s+/g, '').toLowerCase();
            // if (emailRegex.test(email)) {
            //   console.log(`Valid Email: ${email}`);
              return recognizedText; // Resolve with the recognized text
        //     } else {
        //       console.log('Invalid Email. Please speak again.');
        //       throw new Error('Invalid Email'); // Throw an error if the email is invalid
        //     }
        //   })
        //   .catch((error) => {
        //     console.error(error.response.data.detail);
        //     throw error; // Throw the error object
          });
      };
    while (index < input.length) {
      await speak();
      try {
        answer = await listenForSpeech();
        document.getElementById(input[index]).value = answer
        console.log("Recognized Text:", answer,document.getElementById(input[index]));
        index++;
      } catch (error) {
        // Handle the rejected promise (invalid email)
        console.log("Please try again.");
      }
    }
  }


  return (
    <>
       <section className='h-[auto] w-full bg-primary'>
            <div className='flex justify-center items-center w-full h-[auto] p-10'>
                <div className='bg-white h-auto rounded-[1rem] flex flex-col w-5/6'>                               
                    <div className='flex flex-col items-center'>
                        <div className='font-bold text-[3.7rem] mt-10 text-primary'>Job Seeker Application</div>
                        <div className='text-[1.7rem] text-secondary font-semibold'>Hassle Free Submission</div>
                    </div>
                   <div style={{display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'}}>
                    {/* {return for ocr} */}

                   <Webcam 
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={600}
        height={400}
      />
                    </div> 
                    
      <button onClick={captureImage}>Capture Image</button>
      <div>
        <h2>Recognized Text:</h2>
        <p>{recognizedText}</p>
      </div>


      {/* ocr ends here */}
                    <div>
                    <label style={{ display: 'block', marginBottom: '5px',marginTop:'5rem' }}>
  <span style={{ fontSize: '16px', color: 'blue', marginLeft:'70rem',fontWeight: 'bold' }}>Select Language:</span>
  <select
    value={selectedLanguage}
    onChange={(e) => setSelectedLanguage(e.target.value)}
    style={{
      width: '120px',
      fontSize: '16px',
      color: 'black',
      backgroundColor: 'white',
      border: '2px solid #ccc',
      borderRadius: '5px',
      padding: '5px',
    }}
  >
    <option value="english" style={{ fontSize: '16px', color: 'black', background: '#fff' }}>
      English 🇺🇸
    </option>
    <option value="hindi" style={{ fontSize: '16px', color: 'red', background: '#fff' }}>
      Hindi 🇮🇳
    </option>
  </select>
</label>

    </div>
                    <div className='mt-[5rem]'>
                        <form method='POST' onSubmit={policyFormSubmit}>
                            <div>
                            <div className='text-[2.4rem] font-semibold text-[#011F3F] flex gap-x-5 px-16'><div className='w-[4rem] h-[4rem] flex justify-center items-center border-2 rounded-full bg-[#0072BC] text-white border-[#0c5b90]'>1</div> <div>First, tell us about yourself</div></div>
                            <div className='w-full h-auto mt-5'>
                                <div className='px-28 py-10 ml-10 mr-10' name='name_div'><label className='text-[1.6rem]'>Full Name</label> <br />
                                <Input id='fullname' onChange={handleInputChange} autoComplete='off' name='fullname' type='text' width={'80%'} fontSize={'1.2rem'} height={'4rem'} placeholder='Enter your Full Name...' marginTop={'1.5rem'} value={formData.name} />
                                </div> 
                                <div className='mt-1 px-28 ml-10'>
                                    <label className='text-[1.6rem]'>Gender</label>
                                    <div className='flex gap-x-10 mt-[1.5rem]'>
                                        <div className={`w-[8rem] h-[4rem] flex justify-center items-center text-[1.6rem]`}> 
                                            <Switch name='male' isChecked={genderValue === 'male'} onChange={() => handleGenderSwitchChange('male')} colorScheme='green' size={'lg'} /> <span className='ml-3 -mt-1'><img src={male} alt="male" className='w-[3rem]' /></span>
                                        </div>
                                        <div className={`w-[8rem] h-[4rem] flex justify-center items-center text-[1.6rem]`}> 
                                            <Switch name='female' isChecked={genderValue === 'female'} onChange={() => handleGenderSwitchChange('female')} colorScheme='green' size={'lg'} /> <span className='ml-3 -mt-1'><img src={female} alt="female" /></span>
                                        </div>
                                        <div className={`w-[8rem] h-[4rem] flex justify-center items-center text-[1.6rem]`}> 
                                            <Switch name='trans' isChecked={genderValue === 'trans'} onChange={() => handleGenderSwitchChange('trans')} colorScheme='green' size={'lg'} /> <span className='ml-3 -mt-1'><img src={trans} alt="trans" /></span>
                                        </div>
                                    </div>
                                </div> 
                                <div className='mt-10 px-28 ml-10'>
                                    <label className='text-[1.6rem]'>Mobile Number</label> <br />
                                    <InputGroup marginTop={'1.5rem'}>
                                        <InputLeftAddon height={'4rem'} children='+91' />
                                        <Input id='phone' autoComplete='off' value={phone} onChange={(e) => setPhone(e.target.value)} name='phone' type='number' width={'76%'} fontSize={'1.2rem'} height={'4rem'} placeholder='Enter your Phone Number...' />
                                    </InputGroup>                                                                       
                                </div>
                                <div className='mt-10 px-28 ml-10'>
                                    <label className='text-[1.6rem]'>Date of Birth</label> <br />
                                    {/* <Input id='dob' autoComplete='off' value={dob} onChange={(e) => setDob(e.target.value)} name='dob' marginTop={'1.5rem'} placeholder="Select Date of Birth..." size="md" type="date" width={'80%'} fontSize={'1.2rem'} height={'4rem'} /> */}
                                    <Input id='dob' onChange={handleInputChange}autoComplete='off' name='dob' type='text' width={'80%'} fontSize={'1.2rem'} height={'4rem'} placeholder='Enter your DOB...' marginTop={'1.5rem'} value={formData.dob} />                                
                                
                                </div>                                          
                                </div>  
                                <div><hr className='w-full h-[0.2rem] rounded-3xl bg-zinc-200 mt-16 opacity-80' /></div>                               
                                <div className='text-[2.4rem] font-semibold text-[#011F3F] flex gap-x-5 mt-10 px-16'><div className='w-[4rem] h-[4rem] flex justify-center items-center border-2 rounded-full bg-[#0072BC] text-white border-[#0c5b90]'>2</div> <div>Second, fill some general details</div></div>      
                                <div className='w-full h-auto mt-10'>
                                <div className='px-28 py-10 ml-10'>
                                    <label className='text-[1.6rem]'>Email Address</label> <br />
                                    <InputGroup marginTop={'1.5rem'}>
                                        <Input id='email' autoComplete='off' name='email' value={email} onChange={(e) => setEmail(e.target.value)} type='email' width={'80%'} fontSize={'1.2rem'} height={'4rem'} placeholder='Enter your Email Address...'/>
                                    </InputGroup>
                                </div> 
                                <div className='mt-1 px-28 ml-10'>
                                    <label className='text-[1.6rem]'>Pincode</label> <br />
                                    <InputGroup marginTop={'1.5rem'}>
                                        <InputLeftElement pointerEvents='none'><i class="bi bi-geo-alt-fill text-[1.4rem] mt-5"></i></InputLeftElement>
                                        <Input id='pincode' value={pincode} onChange={(e) => setPincode(e.target.value)} autoComplete='off' name='pincode' type='number' width={'80%'} fontSize={'1.2rem'} height={'4rem'} placeholder='Enter your Pincode...' />
                                    </InputGroup> 
                                </div>                         
                                <div className='mt-10 px-28 ml-10'>
                                    <label className='text-[1.6rem]'>Address</label> <br />
                                    <Textarea  id='address' autoComplete='off' name='address' placeholder='Enter your Address...' marginTop={'1.5rem'} fontSize={'1.2rem'} width={'80%'} height={'8rem'} value={formData.address} onChange={handleInputChange} />
                                </div>
                                <div className='mt-10 px-28 ml-10'>
                                    <label className='text-[1.6rem]'>Education</label> <br />
                                    <Select value={education} onChange={(e) => setEducation(e.target.value)} name='education' placeholder='Select your Education...' marginTop={'1.5rem'} width={'80%'} fontSize={'1.2rem'} height={'4rem'}>
                                        <option value='Higher Secondary' fontSize={'1.2rem'}>Higher Secondary</option>
                                        <option value='Under Graduate' fontSize={'1.2rem'}>Under Graduate</option>
                                        <option value='Phd' fontSize={'1.2rem'}>Phd</option>
                                        <option value='Post Graduate' fontSize={'1.2rem'}>Post Graduate</option>
                                    </Select>
                                </div>           
                                </div>
                                <div><hr className='w-full h-[0.2rem] rounded-3xl bg-zinc-200 mt-16 opacity-80' /></div>                                      
                                <div className='w-full h-auto mt-10'>
                                <div className='px-28 py-10 ml-10'>
                                    <label className='text-[1.6rem]'>Are you a NRI ?</label>
                                    <div className='flex gap-x-5 mt-3'>
                                        <div className={`w-[8rem] h-[4rem] flex justify-center items-center text-[1.6rem]`}>                                           
                                        <Switch name='nri_yes' value isChecked={nriSwitchValue === 'yes'} onChange={() => handleNriSwitchChange('yes')} colorScheme='green' size={'lg'} /> <span className='ml-3 -mt-1'>Yes</span>
                                        </div>
                                        <div className={`w-[8rem] h-[4rem] flex justify-center items-center text-[1.6rem]`}>                                       
                                        <Switch name='nri_no' isChecked={nriSwitchValue === 'no'} onChange={() => handleNriSwitchChange('no')} colorScheme='red' size={'lg'} /> <span className='ml-3 -mt-1'>No</span>                                  
                                        </div>
                                    </div>
                                </div> 
                               
                               
                                
                                                                                  
                                <div className='px-36'><button name='submit-btn' className='mb-[1rem] w-[10rem] h-[4rem] rounded-[0.8rem] text-[1.4rem] bg-[#0072BC] hover:bg-white hover:text-[#0072BC] border-2 border-[#0e6ba9] text-white transition-all duration-300 hover:shadow-sm hover:shadow-[#0072BC] outline-none' onClick={(e) => {
                policyFormSubmit(e);                                      
              }}>Submit</button></div>  
                                
                            </div>
                        </div>
                        </form> 
                    </div>
                </div>
                <div className='w-1/6'>
                        <button onClick={voice_btn}><img src={bot} alt="bot" className='w-[20rem] fixed top-[25rem] right-[5rem]' /></button>                      
                </div>           
            </div>
        </section>
    </>
  )
            }

export default PolicyForm
            
