import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectLocation } from "../modules/Location/state/reducers";
// --- FIX: Ensure this is a named import. ---
import { calculateDeliveryFees } from "../modules/Cart/services/deliveryService.js";

// ... (Rest of the hook code is identical to the previous step) ...
const useDeliveryCalculator = (shopId, cartTotal, isEnabled = true) => {
  const locationState = useSelector(selectLocation);
  
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    deliveryOptions: [],
    distanceKm: null,
    isCalculated: false,
  });

  const debounceTimer = useRef(null);

  useEffect(() => {
    if (!isEnabled || !shopId) {
        setState(prev => ({ ...prev, isLoading: false, error: null, deliveryOptions: [] }));
        return;
    }

    const hasGps = locationState.lat && locationState.lng;
    const hasWilaya = !!locationState.wilayaCode;

    if (!hasGps && !hasWilaya) {
      setState(prev => ({ ...prev, isLoading: false, isCalculated: false }));
      return;
    }

    const fetchDeliveryData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const payload = {
          shopId,
          cartTotal,
          ...(hasGps && { userLat: locationState.lat, userLng: locationState.lng }),
          ...(hasWilaya && { wilayaCode: locationState.wilayaCode, wilayaName: locationState.wilayaName }),
        };

        const result = await calculateDeliveryFees(payload);

        if (result.isValid) {
          setState({
            isLoading: false, error: null, deliveryOptions: result.options,
            distanceKm: result.distanceKm || 0, isCalculated: true,
          });
        } else {
          setState({
            isLoading: false,
            error: { code: result.error || "DELIVERY_UNAVAILABLE", message: result.message || "Delivery not available." },
            deliveryOptions: [], distanceKm: result.distanceKm || 0, isCalculated: true,
          });
        }
      } catch (err) {
        setState({
          isLoading: false,
          error: { code: err.error || "API_ERROR", message: err.message || "Failed to calculate delivery." },
          deliveryOptions: [], distanceKm: 0, isCalculated: false,
        });
      }
    };

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
        fetchDeliveryData();
    }, 500);

    return () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };

  }, [
    shopId, cartTotal, locationState.lat, locationState.lng, locationState.wilayaCode, isEnabled
  ]);

  return { ...state, locationStatus: locationState.status, permissionStatus: locationState.permissionStatus };
};

export default useDeliveryCalculator;