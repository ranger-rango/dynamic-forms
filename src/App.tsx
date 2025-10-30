import FormBuilder from './components/formBuilder'
import { addressFormSchema, agentUpdateSchema, contactFormSchema, insuranceQuoteSchema, jobApplicationSchema, productFormSchema, registrationFormSchema } from './formSchemas'

function App() {
  return (
    <>
      <FormBuilder formSchema={contactFormSchema} />
      <FormBuilder formSchema={registrationFormSchema} />
      <FormBuilder formSchema={agentUpdateSchema} />
      <FormBuilder formSchema={productFormSchema} />
      <FormBuilder formSchema={addressFormSchema} />
      <FormBuilder formSchema={jobApplicationSchema} />
      <FormBuilder formSchema={insuranceQuoteSchema} />
    </>
  )
}

export default App
