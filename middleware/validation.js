const { body, param, query, validationResult } = require('express-validator');


const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Ошибки валидации',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};


const validateUserRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Имя должно содержать от 2 до 50 символов')
        .matches(/^[а-яёА-ЯЁa-zA-Z\s]+$/)
        .withMessage('Имя может содержать только буквы и пробелы'),
    
    body('email')
        .isEmail()
        .withMessage('Некорректный email адрес')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Пароль должен содержать минимум 8 символов')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Пароль должен содержать минимум одну строчную букву, одну заглавную букву и одну цифру'),
    
    handleValidationErrors
];


const validateUserLogin = [
    body('email')
        .isEmail()
        .withMessage('Некорректный email адрес')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Пароль обязателен'),
    
    handleValidationErrors
];


const validateUserUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Имя должно содержать от 2 до 50 символов')
        .matches(/^[а-яёА-ЯЁa-zA-Z\s]+$/)
        .withMessage('Имя может содержать только буквы и пробелы'),
    
    body('email')
        .optional()
        .isEmail()
        .withMessage('Некорректный email адрес')
        .normalizeEmail(),
    
    body('password')
        .optional()
        .isLength({ min: 8 })
        .withMessage('Пароль должен содержать минимум 8 символов')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Пароль должен содержать минимум одну строчную букву, одну заглавную букву и одну цифру'),
    
    handleValidationErrors
];


const validateEvent = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Название события должно содержать от 3 до 100 символов'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Описание не должно превышать 1000 символов'),
    
    body('date')
        .isISO8601()
        .withMessage('Некорректная дата события'),
    
    body('locationId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID локации должен быть положительным числом'),
    
    body('categoryId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID категории должен быть положительным числом'),
    
    handleValidationErrors
];


const validateComment = [
    body('content')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Комментарий должен содержать от 1 до 500 символов'),
    
    body('eventId')
        .isInt({ min: 1 })
        .withMessage('ID события должен быть положительным числом'),
    
    handleValidationErrors
];


const validateInvitationCreate = [
    body('EventId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('EventId должен быть положительным числом'),
    body('eventId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('eventId должен быть положительным числом'),
    body('inviteeId')
        .isInt({ min: 1 })
        .withMessage('inviteeId должен быть положительным числом'),
    handleValidationErrors
];


const validateId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID должен быть положительным числом'),
    
    handleValidationErrors
];

const validateEventIdParam = [
    param('eventId')
        .isInt({ min: 1 })
        .withMessage('ID события должен быть положительным числом'),
    handleValidationErrors
];

const validateUserIdParam = [
    param('userId')
        .isInt({ min: 1 })
        .withMessage('ID пользователя должен быть положительным числом'),
    handleValidationErrors
];


const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Номер страницы должен быть положительным числом'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Лимит должен быть от 1 до 100'),
    
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdate,
    validateEvent,
    validateComment,
    validateId,
    validateEventIdParam,
    validateUserIdParam,
    validateInvitationCreate,
    validatePagination
};
