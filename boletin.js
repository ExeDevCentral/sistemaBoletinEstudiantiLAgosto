// Configuración de seguridad y constantes
const CONFIG = {
    MIN_GRADE: 1,
    MAX_GRADE: 10,
    PASSING_GRADE: 4,
    MAX_GRADES: 10,
    ANIMATION_DURATION: 300
};

// Clase principal para manejar el boletín estudiantil
class BoletínEstudiantil {
    constructor() {
        this.grades = [7, 4, 8, 9, 6];
        this.studentId = this.generateStudentId();
        this.isInitialized = false;
        
        // Bind methods to preserve context
        this.handleAddGrade = this.handleAddGrade.bind(this);
        this.handleCalculateAverage = this.handleCalculateAverage.bind(this);
        this.handleFindHighestGrade = this.handleFindHighestGrade.bind(this);
        this.handleCheckFailures = this.handleCheckFailures.bind(this);
    }

    // Inicialización de la aplicación
    async init() {
        try {
            this.setupEventListeners();
            this.displayStudentInfo();
            this.renderGrades();
            this.isInitialized = true;
            console.log('✅ Boletín Estudiantil inicializado correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar:', error);
            this.showError('Error al inicializar la aplicación');
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Botones principales
        const addGradeBtn = document.getElementById('addGradeBtn');
        const calcPromedioBtn = document.getElementById('calcPromedioBtn');
        const calcNotaAltaBtn = document.getElementById('calcNotaAltaBtn');
        const checkAplazoBtn = document.getElementById('checkAplazoBtn');
        
        if (addGradeBtn) {
            addGradeBtn.addEventListener('click', this.handleAddGrade);
            console.log('✅ Event listener agregado para: Agregar Nota');
        }
        
        if (calcPromedioBtn) {
            calcPromedioBtn.addEventListener('click', this.handleCalculateAverage);
            console.log('✅ Event listener agregado para: Calcular Promedio');
        }
        
        if (calcNotaAltaBtn) {
            calcNotaAltaBtn.addEventListener('click', this.handleFindHighestGrade);
            console.log('✅ Event listener agregado para: Buscar Nota Más Alta');
        }
        
        if (checkAplazoBtn) {
            checkAplazoBtn.addEventListener('click', this.handleCheckFailures);
            console.log('✅ Event listener agregado para: Verificar Aplazos');
        }
    }

    // Generar ID único del estudiante
    generateStudentId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `STU-${timestamp}-${random}`.toUpperCase();
    }

    // Mostrar información del estudiante
    displayStudentInfo() {
        const studentIdElement = document.getElementById('studentId');
        const currentDateElement = document.getElementById('currentDate');
        
        if (studentIdElement) {
            studentIdElement.textContent = this.studentId;
        }
        
        if (currentDateElement) {
            const now = new Date();
            currentDateElement.textContent = now.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    // Renderizar calificaciones
    renderGrades() {
        const container = document.getElementById('gradesContainer');
        if (!container) {
            console.error('❌ No se encontró el contenedor de calificaciones');
            return;
        }

        container.innerHTML = '';
        
        this.grades.forEach((grade, index) => {
            const gradeElement = this.createGradeElement(grade, index);
            container.appendChild(gradeElement);
        });
        
        console.log(`✅ Renderizadas ${this.grades.length} calificaciones`);
    }

    // Crear elemento de calificación
    createGradeElement(grade, index) {
        const gradeDiv = document.createElement('div');
        gradeDiv.className = `grade-item ${this.getGradeClass(grade)}`;
        gradeDiv.innerHTML = `
            <div class="grade-number">${grade}</div>
            <div class="grade-label">Nota ${index + 1}</div>
        `;
        
        // Agregar funcionalidad de eliminación
        gradeDiv.addEventListener('click', () => this.removeGrade(index));
        
        return gradeDiv;
    }

    // Obtener clase CSS según la calificación
    getGradeClass(grade) {
        if (grade >= 8) return 'grade-excellent';
        if (grade >= 6) return 'grade-good';
        if (grade >= 4) return 'grade-regular';
        return 'grade-poor';
    }

    // Validar calificación
    validateGrade(grade) {
        const numGrade = Number(grade);
        
        if (isNaN(numGrade)) {
            throw new Error('La calificación debe ser un número válido');
        }
        
        if (numGrade < CONFIG.MIN_GRADE || numGrade > CONFIG.MAX_GRADE) {
            throw new Error(`La calificación debe estar entre ${CONFIG.MIN_GRADE} y ${CONFIG.MAX_GRADE}`);
        }
        
        return Math.round(numGrade * 10) / 10; // Redondear a 1 decimal
    }

    // Agregar nueva calificación
    async handleAddGrade() {
        try {
            console.log('🔄 Agregando nueva calificación...');
            
            if (this.grades.length >= CONFIG.MAX_GRADES) {
                this.showWarning(`Máximo ${CONFIG.MAX_GRADES} calificaciones permitidas`);
                return;
            }

            const grade = prompt('Ingrese una nueva calificación (1-10):');
            if (grade === null) return; // Usuario canceló

            const validatedGrade = this.validateGrade(grade);
            this.grades.push(validatedGrade);
            
            this.renderGrades();
            this.showSuccess(`Calificación ${validatedGrade} agregada exitosamente`);
            
            // Limpiar resultados anteriores
            this.clearResults();
            
        } catch (error) {
            console.error('❌ Error al agregar calificación:', error);
            this.showError(error.message);
        }
    }

    // Eliminar calificación
    removeGrade(index) {
        if (confirm('¿Está seguro de que desea eliminar esta calificación?')) {
            this.grades.splice(index, 1);
            this.renderGrades();
            this.clearResults();
            this.showSuccess('Calificación eliminada exitosamente');
        }
    }

    // Calcular promedio
    async handleCalculateAverage() {
        try {
            console.log('🔄 Calculando promedio...');
            
            if (this.grades.length === 0) {
                this.showWarning('No hay calificaciones para calcular el promedio');
                return;
            }

            const average = this.calculateAverage();
            const element = document.getElementById('promedio');
            
            if (element) {
                element.textContent = average.toFixed(2);
                element.classList.add('animate-pulse');
                
                // Remover animación después de un tiempo
                setTimeout(() => {
                    element.classList.remove('animate-pulse');
                }, CONFIG.ANIMATION_DURATION);
            }
            
            this.showSuccess(`Promedio calculado: ${average.toFixed(2)}`);
            
        } catch (error) {
            console.error('❌ Error al calcular promedio:', error);
            this.showError('Error al calcular el promedio');
        }
    }

    // Calcular promedio matemáticamente
    calculateAverage() {
        const sum = this.grades.reduce((acc, grade) => acc + grade, 0);
        return sum / this.grades.length;
    }

    // Encontrar nota más alta
    async handleFindHighestGrade() {
        try {
            console.log('🔄 Buscando nota más alta...');
            
            if (this.grades.length === 0) {
                this.showWarning('No hay calificaciones para analizar');
                return;
            }

            const highestGrade = Math.max(...this.grades);
            const element = document.getElementById('nota');
            
            if (element) {
                element.textContent = highestGrade;
                element.classList.add('animate-bounce');
                
                setTimeout(() => {
                    element.classList.remove('animate-bounce');
                }, CONFIG.ANIMATION_DURATION);
            }
            
            this.showSuccess(`Nota más alta encontrada: ${highestGrade}`);
            
        } catch (error) {
            console.error('❌ Error al buscar nota más alta:', error);
            this.showError('Error al buscar la nota más alta');
        }
    }

    // Verificar aplazos
    async handleCheckFailures() {
        try {
            console.log('🔄 Verificando aplazos...');
            
            if (this.grades.length === 0) {
                this.showWarning('No hay calificaciones para verificar');
                return;
            }

            const hasFailures = this.grades.some(grade => grade < CONFIG.PASSING_GRADE);
            const element = document.getElementById('aplazo');
            
            if (element) {
                element.textContent = hasFailures ? 'Sí' : 'No';
                element.classList.add('animate-pulse');
                
                setTimeout(() => {
                    element.classList.remove('animate-pulse');
                }, CONFIG.ANIMATION_DURATION);
            }
            
            const message = hasFailures 
                ? `Se encontraron ${this.grades.filter(g => g < CONFIG.PASSING_GRADE).length} aplazo(s)`
                : '¡Felicitaciones! No hay aplazos';
            
            this.showInfo(message);
            
        } catch (error) {
            console.error('❌ Error al verificar aplazos:', error);
            this.showError('Error al verificar aplazos');
        }
    }

    // Limpiar resultados
    clearResults() {
        const elements = ['promedio', 'nota', 'aplazo'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '--';
                element.className = element.className.replace(/animate-\w+/, '');
            }
        });
    }

    // Mostrar notificaciones
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showWarning(message) {
        this.showNotification(message, 'warning');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    // Obtener estadísticas completas
    getStatistics() {
        if (this.grades.length === 0) {
            return null;
        }

        return {
            count: this.grades.length,
            average: this.calculateAverage(),
            highest: Math.max(...this.grades),
            lowest: Math.min(...this.grades),
            failures: this.grades.filter(g => g < CONFIG.PASSING_GRADE).length,
            passing: this.grades.filter(g => g >= CONFIG.PASSING_GRADE).length
        };
    }

    // Exportar datos (para futuras funcionalidades)
    exportData() {
        return {
            studentId: this.studentId,
            grades: [...this.grades],
            statistics: this.getStatistics(),
            timestamp: new Date().toISOString()
        };
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM cargado, inicializando aplicación...');
    
    // Crear instancia global para debugging
    window.boletinApp = new BoletínEstudiantil();
    
    // Inicializar la aplicación
    window.boletinApp.init();
    
    // Agregar funcionalidad de teclas de acceso rápido
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'a':
                    e.preventDefault();
                    window.boletinApp.handleAddGrade();
                    break;
                case 'p':
                    e.preventDefault();
                    window.boletinApp.handleCalculateAverage();
                    break;
                case 'h':
                    e.preventDefault();
                    window.boletinApp.handleFindHighestGrade();
                    break;
                case 'f':
                    e.preventDefault();
                    window.boletinApp.handleCheckFailures();
                    break;
            }
        }
    });
});

// Prevenir acceso desde consola (seguridad básica)
if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'grades', {
        get: () => undefined,
        set: () => console.warn('Acceso directo a grades no permitido por seguridad')
    });
}

console.log('🚀 Boletín Estudiantil cargado con éxito');
console.log('💡 Atajos de teclado: Ctrl+A (agregar), Ctrl+P (promedio), Ctrl+H (más alta), Ctrl+F (aplazos)');