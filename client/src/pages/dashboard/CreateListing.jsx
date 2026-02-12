import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useListings } from '../../hooks/useListings'
import Input from '../../components/Input'
import TextArea from '../../components/TextArea'
import Select from '../../components/Select'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Alert from '../../components/Alert'
import toast from 'react-hot-toast'
import { FiUpload, FiX } from 'react-icons/fi'

const CATEGORIES = [
    { value: 'Cattle', label: 'Cattle' },
    { value: 'Sheep', label: 'Sheep' },
    { value: 'Goats', label: 'Goats' },
    { value: 'Horses', label: 'Horses' },
    { value: 'Other', label: 'Other' },
]

const CreateListing = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { createListing, updateListing, fetchListingById, selectedListing, loading, error } = useListings()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        breed: '',
        age: '',
        weight: '',
        location: '',
        endDate: '',
        images: [],
    })
    const [imageFiles, setImageFiles] = useState([])
    const [currentImages, setCurrentImages] = useState([])

    const isEditing = !!id

    useEffect(() => {
        if (isEditing) {
            fetchListingById(id)
        }
    }, [id])

    useEffect(() => {
        if (isEditing && selectedListing) {
            setFormData({
                title: selectedListing.title || '',
                description: selectedListing.description || '',
                price: selectedListing.price || '',
                category: selectedListing.category || '',
                breed: selectedListing.breed || '',
                age: selectedListing.age || '',
                weight: selectedListing.weight || '',
                location: selectedListing.location || '',
                endDate: selectedListing.endDate ? new Date(selectedListing.endDate).toISOString().split('T')[0] : '',
                images: [], // New images
            })
            setCurrentImages(selectedListing.images || [])
        }
    }, [selectedListing, isEditing])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setImageFiles(prev => [...prev, ...files])
        }
    }

    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index))
    }

    const removeCurrentImage = (index) => {
        // In a real app, this might call an API to delete the image immediately or track deleted images
        setCurrentImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const submissionData = { ...formData, images: imageFiles }

        try {
            if (isEditing) {
                await updateListing(id, submissionData)
                toast.success('Listing updated successfully!')
            } else {
                await createListing(submissionData)
                toast.success('Listing created successfully!')
            }
            navigate('/dashboard/listings')
        } catch (err) {
            toast.error(isEditing ? 'Failed to update listing' : 'Failed to create listing')
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">{isEditing ? 'Edit Listing' : 'Create New Listing'}</h1>

            {error && <Alert type="error" message={error} className="mb-6" />}

            <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                    <div className="space-y-4">
                        <Input
                            name="title"
                            label="Listing Title"
                            placeholder="e.g. Premium Holstein Cow"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                        <TextArea
                            name="description"
                            label="Description"
                            placeholder="Describe your livestock in detail..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                name="category"
                                label="Category"
                                options={CATEGORIES}
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                name="breed"
                                label="Breed"
                                placeholder="e.g. Holstein"
                                value={formData.breed}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </Card>

                <Card className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Details & Pricing</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                name="age"
                                type="number"
                                label="Age (years)"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                name="weight"
                                type="number"
                                label="Weight (kg)"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                name="price"
                                type="number"
                                label="Starting Price"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                name="location"
                                label="Location"
                                placeholder="City, State"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                name="endDate"
                                type="date"
                                label="Auction End Date"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Images</h2>
                    <div className="space-y-4">
                        {/* Current Images (Edit Mode) */}
                        {isEditing && currentImages.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Current Images</p>
                                <div className="flex flex-wrap gap-4">
                                    {currentImages.map((img, index) => (
                                        <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                            <img src={img.url || img} alt={`Current ${index}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeCurrentImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* New Images */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                                <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                                <span className="text-blue-600 font-medium">Click to upload images</span>
                                <span className="text-gray-500 text-sm mt-1">or drag and drop</span>
                            </label>
                        </div>

                        {imageFiles.length > 0 && (
                            <div className="flex flex-wrap gap-4 mt-4">
                                {imageFiles.map((file, index) => (
                                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <FiX className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/dashboard/listings')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                    >
                        {isEditing ? 'Update Listing' : 'Create Listing'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CreateListing
