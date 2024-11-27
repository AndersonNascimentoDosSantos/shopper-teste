/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/unbound-method */
import { type User } from '@/@types/api-response/users'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { useEffect, useRef, useState } from 'react'

// Modal Component
const Modal = ({
  isOpen,
  onClose,
  userData,
}: {
  isOpen: boolean
  onClose: () => void
  userData: User
}) => {
  if (!isOpen) return null

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>User Information</h2>
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        {/* Add more user information as needed */}
      </div>
    </div>
  )
}

export default function MapComponent() {
  const [map, setMap] = useState<google.maps.Map>()
  const ref = useRef<HTMLDivElement>()
  const [markerCluster, setMarkerClusters] = useState<MarkerClusterer>()
  const [marker, setMarker] = useState<{ lat: number; lng: number }>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [userData, setUserData] = useState<any>(null) // Assuming user data is an object with properties like name, email, etc.

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: { lat: 4.4333479181711075, lng: -75.21505129646759 },
          zoom: 10,
        }),
      )
    }
    if (map && !markerCluster) {
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const { lat, lng } = e.latLng
          setMarker({ lat: lat(), lng: lng() })
        }
      })
      setMarkerClusters(new MarkerClusterer({ map, markers: [] }))
    }
  }, [map, markerCluster])

  useEffect(() => {
    if (marker && markerCluster) {
      markerCluster.clearMarkers()
      const googleMarker = new window.google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
      })
      markerCluster.addMarker(googleMarker)

      // Add click event listener to the marker
      googleMarker.addListener('click', () => {
        // Open modal and set user data
        setModalOpen(true)
        setUserData({ name: 'John Doe', email: 'john@example.com' }) // Example user data
      })
    }
  }, [marker, markerCluster])

  const closeModal = () => {
    setModalOpen(false)
    setUserData(null)
  }

  return (
    <>
      <div
        ref={ref as any}
        style={{ height: '100%', width: '700px', minHeight: '700px' }}
        className="mx-auto w-full"
      ></div>
      <Modal isOpen={modalOpen} onClose={closeModal} userData={userData} />
    </>
  )
}
