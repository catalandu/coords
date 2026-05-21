local isMenuOpen = false

RegisterCommand('coords', function()
    if not isMenuOpen then
        OpenCoordsMenu()
    end
end, false)

function OpenCoordsMenu()
    isMenuOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({
        type = "open"
    })
    
    -- Thread to update coords while menu is open
    CreateThread(function()
        while isMenuOpen do
            Wait(50) -- Update every 50ms for a smooth real-time feel without overloading
            
            local ped = PlayerPedId()
            local coords = GetEntityCoords(ped)
            local heading = GetEntityHeading(ped)
            
            SendNUIMessage({
                type = "updateCoords",
                x = coords.x,
                y = coords.y,
                z = coords.z,
                h = heading
            })
        end
    end)
end

function CloseCoordsMenu()
    isMenuOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({
        type = "close"
    })
end

RegisterNUICallback('close', function(data, cb)
    CloseCoordsMenu()
    cb('ok')
end)
