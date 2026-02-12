import { useState } from 'react'
import Input from '../../components/Input'
import TextArea from '../../components/TextArea'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Alert from '../../components/Alert'
import toast from 'react-hot-toast'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Message sent successfully!')
      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-section">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Have a question? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: <FiMail className="w-6 h-6" />, title: 'Email', info: 'support@auctionhub.com' },
            { icon: <FiPhone className="w-6 h-6" />, title: 'Phone', info: '+1 (555) 123-4567' },
            { icon: <FiMapPin className="w-6 h-6" />, title: 'Address', info: '123 Auction St, NY 10001' },
          ].map((contact, idx) => (
            <Card key={idx} className="text-center">
              <div className="text-blue-600 mb-4 flex justify-center">{contact.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{contact.title}</h3>
              <p className="text-gray-600">{contact.info}</p>
            </Card>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto">
          {success && (
            <Alert
              type="success"
              message="Your message has been sent successfully!"
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              label="Your Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              name="email"
              type="email"
              label="Email Address"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              name="subject"
              label="Subject"
              placeholder="How can we help?"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <TextArea
              name="message"
              label="Message"
              placeholder="Tell us more..."
              value={formData.message}
              onChange={handleChange}
              rows={5}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Contact
