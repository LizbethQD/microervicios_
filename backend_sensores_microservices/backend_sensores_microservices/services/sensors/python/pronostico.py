import numpy as np
from scipy.stats import linregress
import sys

#Se Obtiene los argumentos desde la línea de comandos
datosArray = sys.argv[1:]
datosSen = datosArray[:len(datosArray)//2]
datosHora = datosArray[len(datosArray)//2:]

print(datosSen)
print(datosHora)

# Se convierten los datos a un arreglo de enteros y floats respectivamente
horas = np.array([int(h.split(':')[0]) for h in datosHora]) # horas observadas
datos = np.array(datosSen, dtype=float)  # datos correspondientes
 
# Hora actual
hora_actual = horas[-1] 

# Realizar la regresión lineal 
n = len(horas)

sum_x = sum(horas)
sum_y = sum(datos)
sum_xy = sum(x * y for x, y in zip(horas, datos))
sum_x_squared = sum(x ** 2 for x in horas)

# Calcular los coeficientes de la regresión lineal (y = mx + b)
m = (n * sum_xy - sum_x * sum_y) / (n * sum_x_squared - sum_x ** 2)
b = (sum_y - m * sum_x) / n

# Calcular la temperatura predicha para la hora actual
temperatura_predicha = m * hora_actual + b

print(f'TemperaturaActual: {temperatura_predicha}')

# Extrapolación para las próximas horas
horas_futuras = list(range(hora_actual + 1, 25))
datos_extrapoladas = [round(m * h + b, 2) for h in horas_futuras]

print(f'Temperaturas: {datos_extrapoladas}')

