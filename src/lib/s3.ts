import { env } from "@/env";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
	region: env.NEXT_PUBLIC_AWS_REGION,
	credentials: {
		accessKeyId: env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
		secretAccessKey: env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
	},
});

export async function uploadFile({
	file,
	userId,
	bookingId,
}: {
	file: Blob;
	userId: string;
	bookingId: string;
}) {
	const key = `${userId}/${bookingId}`;

	const command = new PutObjectCommand({
		Bucket: "architek",
		Key: key,
		ContentType: file.type,
	});

	const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

	const response = await fetch(uploadUrl, {
		method: "PUT",
		body: file,
		headers: {
			"Content-Type": file.type,
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Failed to upload file: ${response.status} ${response.statusText} - ${errorText}`,
		);
	}

	return key;
}
