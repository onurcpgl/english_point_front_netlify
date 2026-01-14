<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models {
/**
 * @property \Illuminate\Database\Eloquent\Collection|\App\Models\Address[] $addresses
 * @property int $id
 * @property int $user_id
 * @property string|null $title
 * @property string $address_line
 * @property string $city
 * @property string|null $state
 * @property string|null $postal_code
 * @property string $country
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address whereAddressLine($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address whereCountry($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address wherePostalCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address whereState($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Address whereUserId($value)
 */
	class Address extends \Eloquent
{
}
}

namespace App\Models {
/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string|null $location
 * @property string $address
 * @property string|null $phone
 * @property string|null $email
 * @property string|null $image
 * @property string|null $image_gallery
 * @property string $status
 * @property string $latitude
 * @property string $longitude
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CourseSession> $sessions
 * @property-read int|null $sessions_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereImageGallery($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Cafe whereUpdatedAt($value)
 */
	class Cafe extends \Eloquent
{
}
}

namespace App\Models {
/**
 * @property int $id
 * @property int $course_id
 * @property int $instructor_id
 * @property string $session_title
 * @property string|null $description
 * @property string $session_date
 * @property int $duration_minutes
 * @property string $language_level
 * @property string $status
 * @property int $quota
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $cafe_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CourseSessionAnswer> $answers
 * @property-read int|null $answers_count
 * @property-read \App\Models\Cafe|null $cafe
 * @property-read \App\Models\Instructor $instructor
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereCafeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereCourseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereDurationMinutes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereInstructorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereLanguageLevel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereQuota($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereSessionDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereSessionTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSession whereUpdatedAt($value)
 */
	class CourseSession extends \Eloquent
{
}
}

namespace App\Models {
/**
 * @property int $id
 * @property int $course_session_id
 * @property int $start_question_id
 * @property array<array-key, mixed>|null $answer
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\CourseSession $courseSession
 * @property-read \App\Models\StartQuestion $question
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSessionAnswer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSessionAnswer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSessionAnswer query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSessionAnswer whereAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSessionAnswer whereCourseSessionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSessionAnswer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSessionAnswer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSessionAnswer whereStartQuestionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CourseSessionAnswer whereUpdatedAt($value)
 */
	class CourseSessionAnswer extends \Eloquent
{
}
}

namespace App\Models {
/**
 * @property int $id
 * @property string $first_name
 * @property string $last_name
 * @property string $email
 * @property string $phone
 * @property string|null $password
 * @property string|null $remember_token
 * @property string|null $email_verified_at
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\InstructorAvailability> $availabilities
 * @property-read int|null $availabilities_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\InstructorCertificate> $certificates
 * @property-read int|null $certificates_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CourseSession> $courseSessions
 * @property-read int|null $course_sessions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\InstructorEducation> $educations
 * @property-read int|null $educations_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\InstructorPhoto> $photos
 * @property-read int|null $photos_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor whereLastName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Instructor whereUpdatedAt($value)
 */
	class Instructor extends \Eloquent
{
}
}

namespace App\Models {
/**
 * @property int $id
 * @property int $instructor_id
 * @property string $day_of_week
 * @property string $time_from
 * @property string $time_to
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorAvailability newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorAvailability newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorAvailability query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorAvailability whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorAvailability whereDayOfWeek($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorAvailability whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorAvailability whereInstructorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorAvailability whereTimeFrom($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorAvailability whereTimeTo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorAvailability whereUpdatedAt($value)
 */
	class InstructorAvailability extends \Eloquent
{
}
}

namespace App\Models {
/**
 * @property int $id
 * @property int $instructor_id
 * @property string|null $issuer
 * @property string $certification
 * @property string|null $years_of_study
 * @property string|null $certificate_file_path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorCertificate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorCertificate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorCertificate query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorCertificate whereCertificateFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorCertificate whereCertification($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorCertificate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorCertificate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorCertificate whereInstructorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorCertificate whereIssuer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorCertificate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorCertificate whereYearsOfStudy($value)
 */
	class InstructorCertificate extends \Eloquent
{
}
}

namespace App\Models {
/**
 * @property int $id
 * @property int $instructor_id
 * @property string $university
 * @property string $degree
 * @property string|null $degree_type
 * @property string|null $specialization
 * @property string|null $years_of_study
 * @property string|null $diploma_file_path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation whereDegree($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation whereDegreeType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation whereDiplomaFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation whereInstructorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation whereSpecialization($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation whereUniversity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorEducation whereYearsOfStudy($value)
 */
	class InstructorEducation extends \Eloquent
{
}
}

namespace App\Models {
/**
 * @property int $id
 * @property int $instructor_id
 * @property string $photo_path
 * @property int $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorPhoto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorPhoto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorPhoto query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorPhoto whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorPhoto whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorPhoto whereInstructorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorPhoto whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorPhoto wherePhotoPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|InstructorPhoto whereUpdatedAt($value)
 */
	class InstructorPhoto extends \Eloquent
{
}
}

namespace App\Models {
/**
 * @OA\Schema (
 *     schema="StartQuestion",
 *     type="object",
 *     title="StartQuestion Model",
 *     required={"id", "question", "options", "correct_answer"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="question", type="string", example="Türkiye'nin başkenti neresidir?"),
 *     @OA\Property(property="options", type="array",
 *         @OA\Items(type="string")
 *     ),
 *     @OA\Property(property="correct_answer", type="array",
 *         @OA\Items(type="string")
 *     ),
 *     @OA\Property(property="question_type", type="string", example="single"),
 * )
 * @property int $id
 * @property string $question
 * @property string $options
 * @property string $question_type
 * @property int $is_active
 * @property string $banner
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CourseSessionAnswer> $courseAnswers
 * @property-read int|null $course_answers_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestion whereBanner($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestion whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestion whereOptions($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestion whereQuestion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestion whereQuestionType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestion whereUpdatedAt($value)
 */
	class StartQuestion extends \Eloquent
{
}
}

namespace App\Models {
/**
 * @property int $id
 * @property string $uniq_id
 * @property string $answers
 * @property string|null $who_answered
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestionAnswers newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestionAnswers newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestionAnswers query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestionAnswers whereAnswers($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestionAnswers whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestionAnswers whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestionAnswers whereUniqId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestionAnswers whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|StartQuestionAnswers whereWhoAnswered($value)
 */
	class StartQuestionAnswers extends \Eloquent
{
}
}

namespace App\Models {
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property string|null $profile_image
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Address> $addresses
 * @property-read int|null $addresses_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CourseSession> $courseSessions
 * @property-read int|null $course_sessions_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereProfileImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	
}